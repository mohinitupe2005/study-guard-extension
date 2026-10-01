# 🧠Study Guard

A Chrome extension that helps students avoid mid-study distractions. It captures stray thoughts instead of acting on them and get roasted if you try to sneak off to Instagram or YouTube during a focus session.

## The Problem

Students don't stop studying because they're lazy, they stop because of constant mental interruptions:

- "I need to reply to that message."
- "I should apply for that internship."
- "Let me just check Instagram real quick."

Most of these are genuine reminders, not procrastination. But acting on even one of them turns a "quick check" into 20–30 minutes of lost focus. "Study Guard" gives those thoughts a safe place to land so you can get back to work without losing them.

## Features

- ⏱️ Focus Session Timer — start/stop a session with one click, right from the popup
- 📝 Quick Thought Capture— type a stray thought directly in the popup and keep moving
- ✅ Mark Done / Delete — check off captured thoughts once handled, or delete them for good
- 🙃 Sarcastic Interstitials — if you try to visit Instagram, YouTube, Facebook, Twitter/X, or Reddit during an active session, a full-screen (randomly generated) roast shows up instead of letting you scroll in peace


## Screenshots

### Popup — Focus Session & Capture
![Popup screenshot](/popup.png)

### Quick Capture in Action
![Capture screenshot](/running.png)

### Sarcasm Interstitial
![Sarcasm overlay screenshot](/sarcasticFullWindow.png)

## Tech Stack

- **Manifest V3** (Chrome Extensions)
- Vanilla **JavaScript, HTML, CSS** no build step required
- `chrome.storage.local` for persistence
- `chrome.commands` API for the global keyboard shortcut

## Installation (Developer Mode)

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions`
3. Toggle on **Developer mode** (top-right)
4. Click **Load unpacked**
5. Select this project's folder
6. Pin the extension from the puzzle-piece icon in your toolbar

## Usage

1. Click the Study Guard icon and hit **Start Focus Session**
2. Type any stray thought into the capture box and hit Enter it's saved instantly
3. Try visiting Instagram or YouTube while a session is active enjoy the roast
4. Mark thoughts done (✓) or delete them (✕) once you've dealt with them

## Project Structure

\```
study-guard/
├── manifest.json       # Extension config (Manifest V3)
├── background.js       # Service worker — handles keyboard shortcut & badge
├── popup.html           # Extension popup UI
├── popup.js             # Popup logic (session timer, capture, thought list)
├── popup.css            # Popup styling
├── content.js           # Injected into every page — detects distractions, shows overlays
├── content.css           # Styling for the in-page overlays
└── icons/                # Extension icons
\```

## Roadmap

- [ ] AI-generated sarcasm (context-aware, via Claude/OpenAI API) instead of static lines
- [ ] AI thought classification (task / distraction / urgent)
- [ ] Weekly focus analytics & email summary
- [ ] Sync across devices via a backend (Node/Express + MongoDB)
- [ ] Chrome Web Store release

## License

Personal/student project — feel free to fork and adapt