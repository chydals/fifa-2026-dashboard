# 🏆 FIFA World Cup 2026 Dashboard (Taiwan Time)

An interactive, modular, and fully responsive client-side dashboard tracking the expanded 48-team **2026 FIFA World Cup**. All match schedules are localized automatically into **Taiwan Standard Time (TST / UTC+8)** directly within the user's browser layout.

## 🌟 Key Features

- **Official 48-Team Group Mapping:** Complete and accurate data structural arrays encompassing all 12 groups (Groups A through L) and all 48 qualified participating nations.
- **Dynamic Score Tracking & Standings Engine:** Interactive input validation fields allow users to type in game results. The background scripts automatically calculate group points, wins, losses, draws, and goal differentials to update table ranks instantly.
- **Automatic Time Zone Shift:** Translates standard international UTC match times into local Taiwan Time using the native web language internationalization engine (`Intl.DateTimeFormat`).
- **Responsive Sports UX:** Structured grid configurations designed to display statistics cleanly on mobile displays, laptops, and desktop screens.

---

## 📂 Project Architecture

The directory follows a highly clean, modular structure optimized for production builds and deployment tracking:

```text
fifa-2026-dashboard/
│
├── index.html         # Main dashboard layout, viewport configs, and tab elements
├── README.md          # Project documentation and engineering configuration notes
├── css/
│   └── styles.css     # Dark-theme "cyber-sports" UI, responsive breakpoints, and animations
└── js/
    └── app.js         # Core database arrays, group stage managers, and calculation engines# fifa-2026-dashboard
Groups , matches , fixtures , results and more
