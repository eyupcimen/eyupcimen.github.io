// All site content lives here. Edit this file to change disks, skills, icons and the quick view.
window.SITE = {
  person: {
    name: 'Eyüp Çimen',
    title: 'Senior iOS Developer',
    summary: 'Senior iOS Developer with 12+ years of experience building production apps, from fintech super apps to augmented reality. Now also building AI-powered automation with LLMs.',
    status: 'Open to work · No notice period · Weil der Stadt, Germany',
    email: 'cmneyp@gmail.com',
    github: 'https://github.com/eyupcimen',
    x: 'https://x.com/eyupcimen',
    education: 'BSc Applied Physics · Kahramanmaraş Sütçü İmam University · 2003–2008'
  },

  // box: 'work' = left box (black disks), 'side' = right box (colored disks).
  // kind: 'project' | 'skills' | 'term' | 'contact'. Empty url hides the Launch button.
  disks: [
    { id: 'ozan', box: 'work', kind: 'project', name: 'Ozan SuperApp', short: 'OZ', color: '#4B2BD6', ink: '#ffffff',
      company: 'Ozan · Istanbul', role: 'Senior iOS Developer', dates: 'Apr 2022 – Jun 2023', url: 'https://ozan.com',
      bullets: ['8 major features in SwiftUI: Hotel Booking, Ticket Buying, Bill Payment, Gaming, Split Payment, Cashback, ReceiptScan',
        'Modularized with Swift Package Manager: app 20% faster, builds 30% shorter',
        'Optimized Bitrise CI/CD and ran code reviews: 17% fewer production bugs',
        'Protocol-Oriented Programming and MVVM throughout'],
      stack: 'SwiftUI · MVVM · SPM · Firebase · Alamofire · Bitrise' },

    { id: 'bilet', box: 'work', kind: 'project', name: 'Bilet Dükkanı', short: 'BD', color: '#1C4A86', ink: '#ffffff',
      company: 'Roofstacks · Istanbul', role: 'Senior iOS Developer', dates: 'Oct 2021 – Apr 2022', url: '',
      bullets: ['Developed and released a low-cost flight ticket app',
        'Introduced the Wallet feature: ticket purchase 35% faster',
        'Google Analytics for the business team: review cycle improved 23%',
        'Removed crashes and memory leaks with Crashlytics: 11% better performance'],
      stack: 'Clean Swift (VIP) · RxSwift · Realm · Crashlytics · Moya' },

    { id: 'fups', box: 'work', kind: 'project', name: 'Fups Messenger', short: 'FU', color: '#3F6B2A', ink: '#ffffff',
      company: 'Ipucu Software · Istanbul', role: 'Senior iOS Developer', dates: 'Dec 2020 – Oct 2021', url: '',
      bullets: ['Real-time messaging inside the Fups payment app, built on XMPP',
        'Introduced Realm: messages load 45% faster',
        'In-chat money: send / request, family accounts, shared payments',
        'Multithreading with GCD and Operation Queues'],
      stack: 'XMPP · Realm · GCD · POP / OOP' },

    { id: 'idenfit', box: 'work', kind: 'project', name: 'Idenfit', short: 'ID', color: '#0C5E78', ink: '#ffffff',
      company: 'Globme · Istanbul', role: 'Senior iOS Developer', dates: 'Mar 2020 – Dec 2021', url: 'https://idenfit.com',
      bullets: ['HR app: attendance, shifts, leaves and advances',
        'Employee identification with Bluetooth, NFC, QR and RFID',
        'Built Task App and Audit App from scratch',
        'Performance tuning with GCD serial / parallel queues'],
      stack: 'MVVM · GraphQL · Moya · Firebase · NFC / BLE / QR · AVFoundation' },

    { id: 'leo', box: 'work', kind: 'project', name: 'Leo AR', short: 'AR', color: '#5B1F99', ink: '#ffffff',
      company: 'Leo AR · Remote (San Francisco)', role: 'Senior iOS Developer', dates: 'Oct 2019 – Mar 2020', url: '',
      bullets: ['Added Motion Capture to an AR app: ~60 million dance moves recorded',
        'Integrated a native ARKit module into a React Native app'],
      stack: 'ARKit · RealityKit · Motion Capture · React Native' },

    { id: 'thy', box: 'work', kind: 'project', name: 'Turkish Airlines Cargo', short: 'TK', color: '#B50E2A', ink: '#ffffff',
      company: 'Medyasoft Digital · Istanbul', role: 'Senior iOS Developer', dates: 'Jan 2019 – Oct 2019', url: '',
      bullets: ['Modules for the Turkish Airlines Cargo Portal (COMIS)',
        'Fixed memory leaks: 21% better performance',
        'Universal iPhone / iPad support',
        'Turkish Doco (meal reporting): operations 25% faster'],
      stack: 'Auto Layout · Performance · iPhone / iPad' },

    { id: 'odeal', box: 'work', kind: 'project', name: 'Odeal', short: 'OD', color: '#0E7C66', ink: '#ffffff',
      company: 'Odeal · Istanbul', role: 'Senior iOS Developer', dates: 'Jan 2018 – Dec 2018', url: 'https://odeal.com',
      bullets: ['Fintech app 30% more stable, new financial features',
        'Crash-free users from 86% to 99.8% (Crashlytics)'],
      stack: 'MVC · Crashlytics · Fintech' },

    { id: 'pordiva', box: 'work', kind: 'project', name: 'Skylife & friends', short: 'SL', color: '#C77D16', ink: '#111111',
      company: 'Pordiva Mobile System · Istanbul', role: 'iOS Developer', dates: 'Jul 2016 – Dec 2017', url: '',
      bullets: ['Turkish Airlines Skylife Magazine from scratch in 3 months: Mapbox, offline maps with Realm, OneSignal push',
        'Viatori social app: photo / video, location, XMPP chat, 55% faster loading with Realm',
        'Isim Tescil domain app in Objective-C, built in 1 month',
        'Also: Fenerbahçe SK social app, ETA cargo bids, CocaCola One Team'],
      stack: 'Swift · Objective-C · XMPP · Realm · Mapbox' },

    { id: 'freelance', box: 'work', kind: 'project', name: 'Freelance years', short: 'FL', color: '#6B6B6B', ink: '#ffffff',
      company: 'Freelance · Samsun', role: 'iOS Developer', dates: 'Apr 2012 – Jul 2016', url: '',
      bullets: ['Independent App Store apps: Patient Tracking, Radio, Online Exam, Pictionary Diary',
        'Where it started: Objective-C and MVC'],
      stack: 'Objective-C · MVC · App Store' },

    { id: 'legal', box: 'side', kind: 'project', name: 'LegalVector', short: 'LV', color: '#E8B84A', ink: '#111111', body: '#2b3f6b',
      company: 'Side project', role: 'Builder', dates: '[YEAR]', url: '',
      bullets: ['RAG legal knowledge base: lawyers upload documents, users ask questions',
        'Claude answers with source citations',
        'Semantic search with pgvector'],
      stack: 'Next.js · Supabase · pgvector · Claude API' },

    { id: 'n8n', box: 'side', kind: 'project', name: 'AI Content Pipeline', short: 'AI', color: '#EA6A4B', ink: '#111111', body: '#5b2b4f',
      company: 'Side project', role: 'Builder', dates: '[YEAR]', url: '',
      bullets: ['End-to-end YouTube automation: AI video (Veo3, Sora) to auto-upload',
        'Hook analysis with OpenAI Vision',
        'Multi-sheet Google Sheets queue management'],
      stack: 'n8n · Veo3 / Sora · OpenAI Vision · Google Sheets' },

    { id: 'skills', box: 'side', kind: 'skills', name: 'All my skills', short: '{ }', color: '#f2c230', ink: '#111111', body: '#3a3a3a', tagline: '20 skills, three levels.' },
    { id: 'term', box: 'side', kind: 'term', name: 'Unlabeled disk', short: '?', color: '#0d0f0c', ink: '#b8f5a2', tagline: 'No label. Insert at own risk.' },
    { id: 'contact', box: 'side', kind: 'contact', name: 'Damaged disk', short: '@', color: '#f1f0e8', ink: '#111111', tagline: 'Damaged. Try anyway.' }
  ],

  skills: {
    expert: ['Swift', 'SwiftUI', 'UIKit', 'Objective-C', 'MVVM / VIP / MVC', 'Protocol-Oriented Programming'],
    advanced: ['Swift Package Manager', 'Async/Await · GCD', 'ARKit · RealityKit', 'Firebase · Crashlytics', 'RxSwift · Combine', 'Realm · CoreData', 'REST API · GraphQL', 'Bitrise CI/CD', 'n8n Automation', 'LLM Prompt Engineering', 'Claude API · OpenAI API', 'AI-assisted development'],
    intermediate: ['Next.js · TypeScript', 'Supabase · pgvector']
  },

  // Icon wall on the window-side wall. Original line drawings (48x48), not Apple logos.
  icons: [
    { label: 'Swift', sub: 'Language', color: '#d9572b', d: 'M24 30 L6 13 L18 17 L24 9 L30 17 L42 13 Z M24 30 L19 41 M24 30 L29 41' },
    { label: 'iOS', sub: 'iPhone + iPad', color: '#1a1a1a', d: 'M16 5h16a4 4 0 0 1 4 4v30a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4z M20 37h8' },
    { label: 'async / await', sub: 'GCD, concurrency', color: '#1d4fa3', d: 'M38 20a15 15 0 0 0-27-6 M10 7v8h8 M10 28a15 15 0 0 0 27 6 M38 41v-8h-8' },
    { label: 'Combine · Rx', sub: 'Reactive streams', color: '#7a3fa0', d: 'M6 12h12l10 12h14 M6 36h12l10-12 M36 18l6 6-6 6' },
    { label: 'Realm · CoreData', sub: 'Persistence', color: '#3d6b5a', d: 'M10 12c0-3 6-5 14-5s14 2 14 5-6 5-14 5-14-2-14-5z M10 12v24c0 3 6 5 14 5s14-2 14-5V12 M10 24c0 3 6 5 14 5s14-2 14-5' },
    { label: 'REST · GraphQL', sub: 'Networking', color: '#0c5e78', d: 'M24 6a18 18 0 1 0 .01 0z M6 24h36 M24 6c6 6 6 30 0 36 M24 6c-6 6-6 30 0 36' },
    { label: 'Crashlytics', sub: 'Firebase, stability', color: '#b5432a', d: 'M18 14a6 6 0 0 1 12 0 M14 18h20v12a10 10 0 0 1-20 0z M24 18v22 M8 22h6 M34 22h6 M8 32h6 M34 32h6' },
    { label: 'Bitrise CI/CD', sub: 'Build + release', color: '#5b1f99', d: 'M24 6c8 6 10 16 6 26H18C14 22 16 12 24 6z M18 32l-6 6 M30 32l6 6 M24 17a3 3 0 1 0 .01 0' },
    { label: 'NFC · BLE · QR', sub: 'Hardware ID', color: '#0c5e78', d: 'M16 16a11 11 0 0 1 0 16 M22 11a18 18 0 0 1 0 26 M28 6a25 25 0 0 1 0 36 M9 24h.01' },
    { label: 'ARKit', sub: 'RealityKit, MoCap', color: '#5b1f99', d: 'M24 6l16 9v18l-16 9-16-9V15z M8 15l16 9 16-9 M24 24v18' },
    { label: 'n8n', sub: 'Automation', color: '#c8352b', d: 'M6 24a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M20 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M20 36a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M34 24a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M13 21l8-6 M13 27l8 6 M27 15l8 6 M27 33l8-6' },
    { label: 'LLM APIs', sub: 'Claude, OpenAI', color: '#1a1a1a', d: 'M8 10h32v22H20l-8 8v-8H8z M24 14l2 5 5 2-5 2-2 5-2-5-5-2 5-2z' }
  ]
};
