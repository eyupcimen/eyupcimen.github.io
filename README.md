# Floppy portfolio

A 3D room with a 1984-style Mac. Visitors pick a floppy from a box, insert it, and see a project.
Plain HTML/CSS/JS. No build step. Works on GitHub Pages as is.

## Files

- `index.html` — the room (walls, paintings, desk, Mac)
- `data.js` — **all content**: disks, skills, icon wall, contact. Edit this one.
- `app.js` — camera, disks, drag and drop, sounds, quick view
- `style.css` — styles
- `assets/me.jpg` — your photo for the self-portrait painting (add it, see below)

## Preview locally

```bash
cd ~/eyupcimen.github.io
python3 -m http.server 8000
# open http://localhost:8000
```

## Add your photo (Claude Code prompt)

> Copy my photo from `<path to photo>` to `assets/me.jpg`. Resize it to 600px wide, JPG quality 82, portrait crop around the face. Do not change any other file.

Until the file exists, the painting shows the old avatar.

## Go live

The room is the home page (repo root). GitHub Pages serves `master`. The old site lives in `classic/`.
Tell Claude Code **"publish"** to commit and push.

## Wall paintings (edit yourself)

1. Open `data.js`, find `wall:`.
2. Plaque text: change `title`, `artist`, `medium`.
3. Picture: copy a JPG/PNG into `assets/wall/` and set `image: 'assets/wall/<file>.jpg'`.
   The picture fills the existing frame (cropped to fit). `image: ''` keeps the drawn painting.
   Self-portrait (`me`) uses `assets/me.jpg`; it shows the avatar until that file exists.
4. Preview at http://localhost:8000, then tell Claude Code **"publish"** (commit + push to GitHub Pages).

Frame size and position live in `index.html`. Ask before changing those.

## Add things

- New project disk: add one object to `disks` in `data.js` (`box: 'work'` or `'side'`).
- New skill: add a string to `skills.expert`, `advanced` or `intermediate`.
- New icon tile: add one object to `icons` (a 48x48 SVG path).
