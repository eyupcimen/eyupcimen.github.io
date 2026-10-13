(function () {
  'use strict';

  var S = window.SITE;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  // ---------- state ----------
  var state = { phase: 'idle', current: null, cam: 'room', drag: null };
  var timers = [];
  var later = function (ms, fn) { timers.push(setTimeout(fn, ms)); };
  var clearLater = function () { timers.forEach(clearTimeout); timers = []; };
  var diskById = function (id) { return S.disks.filter(function (d) { return d.id === id; })[0]; };
  function set(patch) { for (var k in patch) state[k] = patch[k]; render(); }

  // ---------- fit the 1280x800 stage into the window ----------
  var stage = $('stage');
  function fit() {
    var s = Math.min(window.innerWidth / 1280, window.innerHeight / 800);
    var x = (window.innerWidth - 1280 * s) / 2;
    var y = (window.innerHeight - 800 * s) / 2;
    stage.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + s + ')';
  }
  window.addEventListener('resize', fit);
  fit();

  // ---------- camera ----------
  // Lens is 760px: a target at distance P renders 1:1.
  var P = 760;
  var CAMS = {
    room: { x: 200, y: -560, z: 0, d: 2350, rx: -7, ry: 20 },
    mac: { x: 0, y: -323, z: 60, d: P, rx: 0, ry: 0 },
    swiftui: { x: 60, y: -1000, z: -396, d: 875, rx: 0, ry: 0 },
    swift: { x: -700, y: -1060, z: -396, d: 875, rx: 0, ry: 0 },
    objc: { x: -1220, y: -1220, z: -396, d: 685, rx: 0, ry: 0 },
    me: { x: -1220, y: -850, z: -396, d: 760, rx: 0, ry: 0 },
    mvvm: { x: 470, y: -990, z: -396, d: 685, rx: 0, ry: 0 },
    clean: { x: -690, y: -670, z: -396, d: 610, rx: 0, ry: 0 },
    icons: { x: 1796, y: -1000, z: 470, d: 1000, rx: 0, ry: 90 }
  };
  function camTransform(name) {
    var C = CAMS[name] || CAMS.room;
    return 'translateZ(' + (P - C.d) + 'px) rotateX(' + C.rx + 'deg) rotateY(' + C.ry + 'deg) translate3d(' + (-C.x) + 'px,' + (-C.y) + 'px,' + (-C.z) + 'px)';
  }

  // ---------- sound (all synthesized, no files) ----------
  var ac = null;
  function sfx(type) {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ac = ac || new AC();
      var now = ac.currentTime, i, g, o, src, buf, ch, len;
      if (type === 'chime') {
        // Original rolled D-major bell (not Apple's startup chime).
        var out = ac.createGain(), lp = ac.createBiquadFilter();
        lp.type = 'lowpass'; lp.frequency.value = 2400; out.gain.value = 0.18;
        out.connect(lp); lp.connect(ac.destination);
        [146.83, 220.0, 293.66, 369.99, 440.0, 587.33].forEach(function (f, n) {
          var t = now + n * 0.035;
          [[1, 'triangle', 1], [2, 'sine', 0.35], [3.01, 'sine', 0.12]].forEach(function (h) {
            var os = ac.createOscillator(), gg = ac.createGain();
            os.type = h[1]; os.frequency.value = f * h[0];
            gg.gain.setValueAtTime(0.0001, t);
            gg.gain.exponentialRampToValueAtTime(h[2], t + 0.012);
            gg.gain.exponentialRampToValueAtTime(0.0001, t + 2.6 - n * 0.12);
            os.connect(gg); gg.connect(out); os.start(t); os.stop(t + 2.7);
          });
        });
      } else if (type === 'tick' || type === 'click') {
        len = Math.floor(ac.sampleRate * (type === 'tick' ? 0.012 : 0.04));
        buf = ac.createBuffer(1, len, ac.sampleRate); ch = buf.getChannelData(0);
        for (i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, type === 'tick' ? 10 : 6);
        src = ac.createBufferSource(); src.buffer = buf; g = ac.createGain();
        if (type === 'tick') {
          var bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2600 + Math.random() * 900; bp.Q.value = 3.5;
          g.gain.value = 0.9; src.connect(bp); bp.connect(g);
        } else { g.gain.value = 0.5; src.connect(g); }
        g.connect(ac.destination); src.start(now);
      } else if (type === 'whir') {
        o = ac.createOscillator(); g = ac.createGain();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(70, now); o.frequency.linearRampToValueAtTime(110, now + 0.5);
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.05, now + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
        o.connect(g); g.connect(ac.destination); o.start(now); o.stop(now + 0.85);
      }
    } catch (e) {}
  }
  // Browsers only allow sound after a user gesture: play the chord on the first click/touch.
  window.addEventListener('pointerdown', function first() {
    window.removeEventListener('pointerdown', first, true);
    sfx('chime');
  }, true);

  // ---------- build disks + icon tiles ----------
  var BOXES = { work: { x: -470, label: 'WORK 2012–2023' }, side: { x: 470, label: 'SIDE + SYSTEM' } };
  var diskEls = {};
  (function buildBoxes() {
    var html = '';
    Object.keys(BOXES).forEach(function (key) {
      var bx = BOXES[key].x;
      var list = S.disks.filter(function (d) { return d.box === key; });
      var n = list.length;
      html += '<div class="p" style="width:200px;height:70px;left:-100px;top:-35px;transform:translate3d(' + bx + 'px,-35px,-150px);background:rgba(34,34,40,.92);border-radius:4px"></div>';
      html += '<div class="p" style="width:330px;height:70px;left:-165px;top:-35px;transform:translate3d(' + (bx - 100) + 'px,-35px,15px) rotateY(-90deg);background:rgba(44,44,52,.88);border-radius:4px"></div>';
      html += '<div class="p" style="width:330px;height:70px;left:-165px;top:-35px;transform:translate3d(' + (bx + 100) + 'px,-35px,15px) rotateY(90deg);background:rgba(52,52,60,.88);border-radius:4px"></div>';
      list.forEach(function (d, i) {
        var tag = d.tagline || (d.company ? d.company.split(' · ')[0] + (d.dates ? ' · ' + d.dates.replace(/[A-Za-z]{3} /g, '') : '') : '');
        html += '<div class="p" style="width:180px;height:144px;left:-90px;top:-144px;transform:translate3d(' + bx + 'px,' + (-(n - 1 - i) * 22 - 2) + 'px,' + (-130 + i * 34) + 'px)">' +
          '<button class="bdisk" data-disk="' + esc(d.id) + '" aria-label="Insert ' + esc(d.name) + ' disk" style="background:' + esc(d.body || '#1f2126') + '">' +
          '<span class="tab" style="left:' + ((i % 3) * 61) + 'px;background:' + esc(d.color) + ';color:' + esc(d.ink) + '">' + esc(d.short) + '</span>' +
          '<span class="sh"></span>' +
          '<span class="lb"><i style="background:' + esc(d.color) + '"></i><span>' + esc(d.name) + '</span><small>' + esc(tag) + '</small></span>' +
          '</button></div>';
      });
      html += '<div class="p" style="width:200px;height:70px;left:-100px;top:-35px;transform:translate3d(' + bx + 'px,-35px,180px);background:rgba(40,40,47,.9);border-radius:4px;box-shadow:inset 0 2px 0 rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;font-family:VT323,monospace;font-size:18px;letter-spacing:.14em;color:#b9b6aa">' + esc(BOXES[key].label) + '</div>';
    });
    $('boxes').outerHTML = html;
    Array.prototype.forEach.call(document.querySelectorAll('.bdisk'), function (el) { diskEls[el.getAttribute('data-disk')] = el; });
  })();

  (function buildTiles() {
    var html = '';
    S.icons.forEach(function (t, i) {
      var y = -1150 + Math.floor(i / 6) * 260, z = -110 + (i % 6) * 230;
      html += '<div class="p art tile" data-art="icons" tabindex="0" role="button" aria-label="Skill: ' + esc(t.label) + '" style="width:170px;height:200px;left:-85px;top:-100px;transform:translate3d(1796px,' + y + 'px,' + z + 'px) rotateY(-90deg)">' +
        '<svg width="76" height="76" viewBox="0 0 48 48" fill="none" stroke="' + esc(t.color) + '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + esc(t.d) + '"></path></svg>' +
        '<b>' + esc(t.label) + '</b><small>' + esc(t.sub) + '</small></div>';
    });
    $('tiles').outerHTML = html;
  })();

  // Portrait fallback until floppy/assets/me.jpg exists.
  var portrait = $('portrait');
  var portraitFallback = function () {
    if (portrait.dataset.fallback) return;
    portrait.dataset.fallback = '1';
    portrait.src = '../assets/img/avataaars.svg'; portrait.style.objectFit = 'contain'; portrait.style.background = '#e9e3d3';
  };
  portrait.addEventListener('error', portraitFallback);
  if (portrait.complete && portrait.naturalWidth === 0) portraitFallback();

  // ---------- day / night window ----------
  var hour = new Date().getHours(), day = hour >= 7 && hour < 19;
  $('sky').classList.add(day ? 'sky-day' : 'sky-night');
  $('sunpatch').classList.add(day ? 'is-day' : 'is-night');

  // ---------- screen content ----------
  function cells(rows) {
    return rows.map(function (r) {
      return r.split('').map(function (c) { return '<div style="background:' + (c === '#' ? 'currentColor' : 'transparent') + '"></div>'; }).join('');
    }).join('');
  }
  var HAPPY = ['############', '#..........#', '#...#..#...#', '#...#..#...#', '#..........#', '#..#....#..#', '#...####...#', '#..........#', '############', '....####....'];
  var SAD = ['############', '#..........#', '#.#.#..#.#.#', '#..#....#..#', '#.#.#..#.#.#', '#..........#', '#...####...#', '#..#....#..#', '############', '....####....'];

  function winHTML(title, body, foot) {
    return '<div class="win fade"><div class="win-title"><button class="closebox" data-action="eject" aria-label="Eject disk"></button><span>' + esc(title) + '</span></div>' +
      '<div class="scroll" tabindex="0">' + body + '</div>' + (foot ? '<div class="winbar">' + foot + '</div>' : '') + '</div>';
  }
  function projectHTML(d) {
    var body = '<div class="h1">' + esc(d.name) + '</div><div>' + esc(d.company) + '</div><div>' + esc(d.role) + ' · ' + esc(d.dates) + '</div>' +
      '<div class="sec">What I did</div><ul>' + d.bullets.map(function (b) { return '<li>• ' + esc(b) + '</li>'; }).join('') + '</ul>' +
      '<div class="sec">Stack</div><div>' + esc(d.stack) + '</div>';
    var foot = d.url ? '<a class="launch" href="' + esc(d.url) + '" target="_blank" rel="noopener noreferrer">Launch ↗</a>' : '';
    return winHTML(d.name, body, foot);
  }
  function skillsHTML() {
    var lv = function (name, list) { return '<div class="sec">' + name + '</div><ul>' + list.map(function (s) { return '<li>• ' + esc(s) + '</li>'; }).join('') + '</ul>'; };
    return winHTML('Skills', '<div class="h1">All my skills</div><div>12+ years of native iOS</div>' +
      lv('Expert', S.skills.expert) + lv('Advanced', S.skills.advanced) + lv('Intermediate', S.skills.intermediate));
  }
  function termHTML() {
    return '<div class="term fade"><div id="termLines"><div>FloppyOS 1.0. Type "help".</div></div>' +
      '<div class="term-row"><span>eyup@floppy ~ %</span><label for="termIn" class="sr">Terminal command</label>' +
      '<input id="termIn" class="term-in" autocomplete="off" spellcheck="false"></div></div>';
  }
  function sadHTML() {
    return '<div class="sad fade"><div class="pix sm">' + cells(SAD) + '</div><div>Error 404: job not found.</div>' +
      '<div style="color:#b9b6aa">Let\'s fix that together.</div><div style="display:flex;gap:14px">' +
      '<a href="mailto:' + esc(S.person.email) + '">' + esc(S.person.email) + '</a>' +
      '<a href="' + esc(S.person.github) + '" target="_blank" rel="noopener noreferrer">GitHub</a>' +
      '<a href="' + esc(S.person.x) + '" target="_blank" rel="noopener noreferrer">X</a></div></div>';
  }
  var screenKey = '';
  function renderScreen() {
    var d = diskById(state.current), p = state.phase, key, html;
    if (p === 'idle' || p === 'inserting' || p === 'ejecting') {
      key = 'idle';
      html = '<div class="center"><div class="blink" style="width:56px;height:58px;background:#111;border-radius:3px 8px 3px 3px;position:relative">' +
        '<div style="position:absolute;left:15px;top:0;width:26px;height:18px;background:#f1f0e8"></div>' +
        '<div style="position:absolute;left:7px;right:7px;bottom:5px;height:26px;background:#f1f0e8;display:flex;align-items:center;justify-content:center;font-size:26px;line-height:1">?</div></div>' +
        '<div style="font-size:22px">Insert a disk</div></div>';
    } else if (p === 'boot') {
      key = 'boot'; html = '<div class="center fade"><div class="pix">' + cells(HAPPY) + '</div></div>';
    } else if (p === 'welcome') {
      key = 'welcome:' + d.id;
      html = '<div class="center fade"><div style="border:2px solid #111;box-shadow:3px 3px 0 #111;background:#fff;padding:14px 22px;text-align:center">' +
        '<div style="font-size:24px">Welcome to</div><div style="font-size:30px">' + esc(d.name) + '</div></div></div>';
    } else if (p === 'sad') {
      key = 'sad'; html = sadHTML();
    } else {
      key = 'app:' + d.id;
      html = d.kind === 'term' ? termHTML() : d.kind === 'skills' ? skillsHTML() : projectHTML(d);
    }
    if (key === screenKey) return;
    screenKey = key;
    var scr = $('screen');
    scr.innerHTML = html;
    scr.classList.toggle('is-dark', key === 'app:term');
    if (key === 'app:term') setTimeout(function () { var t = $('termIn'); if (t) t.focus(); }, 50);
  }

  // ---------- terminal ----------
  function runCmd(raw) {
    var cmd = raw.trim().toLowerCase();
    var names = S.disks.filter(function (d) { return d.kind === 'project'; }).map(function (d) { return d.name; });
    if (!cmd) return [];
    if (cmd === 'help') return ['whoami  ls skills  ls projects', 'contact  cv  eject  clear'];
    if (cmd === 'whoami') return [S.person.name + ' · ' + S.person.title, '12+ years · since 2012 (Objective-C)', 'Weil der Stadt, Germany'];
    if (cmd === 'ls skills') return S.skills.expert.slice(0, 4).concat(['...and ' + (S.skills.advanced.length + S.skills.intermediate.length + 2) + ' more on the skills disk']);
    if (cmd === 'ls projects' || cmd === 'ls') return names;
    if (cmd === 'contact') return ['mail    ' + S.person.email, 'github  github.com/eyupcimen'];
    if (cmd === 'cv') return ['[CV LINK]'];
    if (cmd.indexOf('sudo') === 0) return ['Nice try.'];
    return ['command not found: ' + raw.trim(), 'type "help"'];
  }
  $('screen').addEventListener('keydown', function (e) {
    if (e.target.id !== 'termIn' || e.key !== 'Enter') return;
    var raw = e.target.value, box = $('termLines');
    e.target.value = '';
    var cmd = raw.trim().toLowerCase();
    if (cmd === 'clear') { box.innerHTML = ''; return; }
    if (cmd === 'eject') { eject(); return; }
    [{ t: '% ' + raw }].concat(runCmd(raw).map(function (t) { return { t: t }; })).forEach(function (l) {
      var div = document.createElement('div'); div.textContent = l.t; box.appendChild(div);
    });
    while (box.children.length > 9) box.removeChild(box.firstChild);
  });

  // ---------- disk flow ----------
  function insert(id) {
    if (state.cam !== 'mac') {
      clearLater();
      set({ cam: 'mac', drag: null });
      later(1250, function () { insert(id); });
      return;
    }
    if (state.current === id && state.phase !== 'idle') { set({ drag: null }); return; }
    clearLater();
    var go = function () {
      var d = diskById(id);
      set({ current: id, phase: 'inserting', drag: null });
      sfx('click');
      later(550, function () { set({ phase: d.kind === 'contact' ? 'sad' : 'boot' }); sfx('whir'); });
      if (d.kind === 'contact') return;
      if (d.kind === 'term' || d.kind === 'skills') { later(1500, function () { set({ phase: 'app' }); }); return; }
      later(1600, function () { set({ phase: 'welcome' }); });
      later(2500, function () { set({ phase: 'app' }); });
    };
    if (state.current && state.phase !== 'idle') {
      set({ phase: 'ejecting', drag: null }); sfx('click'); later(480, go);
    } else go();
  }
  function eject() {
    if (!state.current || state.phase === 'idle') return;
    clearLater(); sfx('click');
    set({ phase: 'ejecting' });
    later(600, function () { set({ phase: 'idle', current: null }); });
    later(900, function () { set({ cam: 'room' }); });
  }

  // ---------- drag from the box ----------
  var drag = null;
  function toLocal(cx, cy) {
    var r = stage.getBoundingClientRect(), s = r.width / 1280 || 1;
    return { x: (cx - r.left) / s, y: (cy - r.top) / s };
  }
  function overMac(cx, cy) {
    var hit = document.elementFromPoint(cx, cy);
    return !!(hit && hit.closest && hit.closest('[data-drop]'));
  }
  document.addEventListener('pointerdown', function (e) {
    var b = e.target.closest && e.target.closest('.bdisk');
    if (!b || e.button !== 0) return;
    e.preventDefault();
    drag = { id: b.getAttribute('data-disk'), sx: e.clientX, sy: e.clientY, moved: false };
  });
  window.addEventListener('pointermove', function (e) {
    if (!drag) return;
    if (!drag.moved && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 6) return;
    drag.moved = true;
    var p = toLocal(e.clientX, e.clientY);
    set({ drag: { id: drag.id, x: p.x, y: p.y, over: overMac(e.clientX, e.clientY) } });
  });
  window.addEventListener('pointerup', function (e) {
    if (!drag) return;
    var d = drag; drag = null;
    if (!d.moved || overMac(e.clientX, e.clientY)) insert(d.id); else set({ drag: null });
  });

  // ---------- clicks ----------
  // Keyboard users: Enter / Space on a disk inserts it (pointer clicks are handled above).
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.bdisk');
    if (b && e.detail === 0) insert(b.getAttribute('data-disk'));
  });
  $('eject').addEventListener('click', eject);
  $('screen').addEventListener('click', function (e) {
    if (e.target.closest('[data-action="eject"]')) eject();
  });
  $('mac3d').addEventListener('click', function () { if (state.cam !== 'mac') set({ cam: 'mac' }); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.art');
    if (a) set({ cam: a.getAttribute('data-art') });
  });
  document.addEventListener('keydown', function (e) {
    var a = e.target.closest && e.target.closest('.art');
    if (a && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); set({ cam: a.getAttribute('data-art') }); }
  });
  $('viewport').addEventListener('click', function (e) {
    if (state.cam === 'room') return;
    if (e.target.closest('.mac') || e.target.closest('.bdisk') || e.target.closest('.art')) return;
    set({ cam: 'room' });
  });
  $('back').addEventListener('click', function () { clearLater(); set({ cam: 'room', drag: null }); });

  // Old-mouse wheel tick: one "tık" per notch.
  var wheelAcc = 0, lastTick = 0;
  $('screen').addEventListener('wheel', function (e) {
    wheelAcc += Math.abs(e.deltaY * (e.deltaMode === 1 ? 33 : 1));
    if (wheelAcc < 40) return;
    wheelAcc = wheelAcc % 40;
    var now = Date.now();
    if (now - lastTick < 32) return;
    lastTick = now; sfx('tick');
  }, { passive: true });

  // ---------- quick view ----------
  function quickHTML() {
    var p = S.person;
    var work = S.disks.filter(function (d) { return d.box === 'work'; });
    var side = S.disks.filter(function (d) { return d.box === 'side' && d.kind === 'project'; });
    var row = function (d) {
      return '<div class="qrow"><strong>' + (d.url ? '<a href="' + esc(d.url) + '" target="_blank" rel="noopener noreferrer">' + esc(d.name) + '</a>' : esc(d.name)) + '</strong>' +
        '<span>' + esc(d.company) + ' · ' + esc(d.role) + '</span><span>' + esc(d.dates) + '</span></div>';
    };
    var chips = function (l) { return '<div class="qskills">' + l.map(function (s) { return '<span>' + esc(s) + '</span>'; }).join('') + '</div>'; };
    return '<button class="qclose" id="qclose" aria-label="Close quick view"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M2 2 L12 12 M12 2 L2 12"></path></svg></button>' +
      '<h1>' + esc(p.name) + '</h1><p><strong>' + esc(p.title) + '</strong> · ' + esc(p.status) + '</p><p>' + esc(p.summary) + '</p>' +
      '<div class="qlinks"><a href="mailto:' + esc(p.email) + '">' + esc(p.email) + '</a><a href="' + esc(p.github) + '" target="_blank" rel="noopener noreferrer">GitHub</a><a href="' + esc(p.x) + '" target="_blank" rel="noopener noreferrer">X / Twitter</a></div>' +
      '<h2>Experience</h2>' + work.map(row).join('') +
      '<h2>Side projects</h2>' + side.map(row).join('') +
      '<h2>Skills · expert</h2>' + chips(S.skills.expert) +
      '<h2>Skills · advanced</h2>' + chips(S.skills.advanced) +
      '<h2>Skills · intermediate</h2>' + chips(S.skills.intermediate) +
      '<h2>Education</h2><p>' + esc(p.education) + '</p>' +
      '<button class="qenter" id="qenter">Enter the room</button>';
  }
  var lastFocus = null;
  function openQuick() {
    lastFocus = document.activeElement;
    $('quick').innerHTML = quickHTML();
    $('quick').hidden = false; $('qback').hidden = false;
    $('qclose').addEventListener('click', closeQuick);
    $('qenter').addEventListener('click', closeQuick);
    $('qclose').focus();
  }
  function closeQuick() {
    $('quick').hidden = true; $('qback').hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $('quickBtn').addEventListener('click', openQuick);
  $('qback').addEventListener('click', closeQuick);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('quick').hidden) closeQuick(); });

  // ---------- render ----------
  var floppyFill = function (el, d) {
    el.querySelector('.floppy').style.background = d.body || '#1f2126';
    el.querySelector('.floppy-label i').style.background = d.color;
    el.querySelector('.floppy-label span').textContent = d.name;
  };
  function render() {
    var cur = diskById(state.current), p = state.phase, inside = !!state.current && p !== 'idle', dr = state.drag;
    $('world').style.transform = camTransform(state.cam);
    $('back').hidden = state.cam === 'room';
    $('mac').classList.toggle('is-over', !!(dr && dr.over));
    $('slotDisk').hidden = !(inside && p !== 'inserting' && p !== 'ejecting');
    $('inserting').hidden = p !== 'inserting';
    $('ejecting').hidden = p !== 'ejecting';
    if (cur) { floppyFill($('inserting'), cur); floppyFill($('ejecting'), cur); }
    Object.keys(diskEls).forEach(function (id) {
      diskEls[id].classList.toggle('is-out', inside && state.current === id);
      diskEls[id].classList.toggle('is-lift', !!(dr && dr.id === id));
    });
    var fly = $('fly');
    fly.hidden = !dr;
    if (dr) { floppyFill(fly, diskById(dr.id)); fly.style.left = Math.round(dr.x - 42) + 'px'; fly.style.top = Math.round(dr.y - 44) + 'px'; }
    var hint = 'Pick a disk from a box. Click it, or drag it into the Mac.';
    if (dr) hint = dr.over ? 'Let go to insert.' : 'Drop it on the Mac.';
    else if (state.cam !== 'room' && state.cam !== 'mac') hint = 'Click anywhere to step back.';
    else if (inside && p === 'app' && cur && cur.kind === 'project') hint = 'Press eject to swap disks. Try the unlabeled one.';
    else if (state.cam === 'room') hint = 'Pick a disk, or look at the walls.';
    $('hint').textContent = hint;
    renderScreen();
  }

  // ---------- clock ----------
  function tick() {
    var d = new Date();
    $('clock').textContent = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }
  tick(); setInterval(tick, 15000);

  render();
  // Phones: the 3D room is too small to use, so start on the readable quick view.
  if (window.matchMedia('(max-width: 760px)').matches) openQuick();
})();
