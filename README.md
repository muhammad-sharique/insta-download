# Instagram Audio Downloader

Instagram Audio Downloader is an open-source Chrome extension for capturing, organizing, and downloading Instagram voice notes directly from the web client. Everything happens locally in your browser, giving you full transparency and control over the code you run.

## Features

- Automatic detection of audio messages inside Instagram DMs and Messenger web conversations.
- Popup interface that lists every detected clip in chronological order with live updates.
- One-click download workflow with filenames formatted as `Instagram-audio-YYYY-MM-DD HH-MM-SS GMT±HHMM.mp4`.
- Lightweight footprint: no tracking, no external servers, just client-side JavaScript.

## Why Open Source?

- **Transparency**: Inspect how audio requests are intercepted and stored.
- **Extensibility**: Fork the project to add integrations, port it to other browsers, or customize the UI.
- **Collaboration**: Issues and pull requests are welcome; see the contributing section for guidelines.

## Quick Start

### Prerequisites

- Chrome 114+ or any Chromium-based browser with extension developer mode.

### Install from Source

1. Clone or download this repository.
2. Open `chrome://extensions/` and enable Developer Mode.
3. Click **Load unpacked** and select the project directory.
4. (Optional) Replace the placeholder icons under `icons/` with your own PNG assets.

## Using the Extension

1. Log in to Instagram web and open a DM thread that contains voice notes.
2. Open the extension popup to monitor detected clips in real time.
3. Click the download button inside the popup or right from Instagram (if integrated) to save the file.
4. Downloads are stored in `Downloads/Instagram Audio/` with the human-readable timestamp naming pattern above.

## Project Structure

```
insta-download/
├── background.js   // Service worker handling detection, storage, downloads
├── content.js      // Lightweight relay that surfaces background messages to the page
├── injected.js     // Page-level override that intercepts audio network requests
├── manifest.json   // Chrome extension manifest (MV3)
├── popup.css       // Popup styling
├── popup.html      // Popup markup
├── popup.js        // Popup logic and DOM rendering helpers
└── README.md
```

## Development Guide

- The codebase is pure JavaScript; no bundler is required.
- Use Chrome DevTools on Instagram to watch console logs from the injected script and popup.
- To reset detected audio, clear extension storage via the Extensions page.
- When testing downloads, confirm the filename override fires in `chrome://downloads/`.

## Contributing

Interested in helping out?

1. Fork the repository and create a feature or fix branch.
2. Keep changes focused and include context in commit messages.
3. Manually test on Instagram web (DMs and audio downloads) before opening a pull request.
4. Open a PR describing the motivation, approach, and testing notes.

Bug reports and feature requests are tracked via GitHub issues. Please attach console logs or reproduction steps when possible.

## Roadmap

- Optional batching for multiple downloads.
- Alternate filename templates and localization support.
- Firefox/Manifest V2 compatibility layer.
- Automated regression tests for popup logic.

## Support & Etiquette

- Check the issue tracker for known problems before filing a new one.
- Respect Instagram's Terms of Service and the privacy of the people whose audio you download.
- Remember that the maintainers volunteer their time; constructive feedback and reproducible reports help everyone.

## License

This project is released under the MIT License. See LICENSE for full terms.