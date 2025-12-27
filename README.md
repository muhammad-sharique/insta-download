# Instagram Audio Downloader

A Chrome extension that allows you to download and save Instagram audio messages (voice notes) directly from your Instagram direct messages.

## 🎯 Features

- **One-click Downloads**: Download Instagram audio messages with a single click
- **Clean Interface**: Seamlessly integrates with Instagram's UI
- **Auto-detection**: Automatically detects audio messages and adds download buttons
- **Multiple Formats**: Supports various audio formats (MP3, M4A, WAV, etc.)
- **Download Management**: Track your downloads and view statistics
- **Privacy-focused**: Works entirely in your browser, no data sent to external servers

## 🚀 Installation

### From Source (Developer Mode)

1. **Download the Extension**
   - Clone or download this repository to your computer
   - Extract the files to a folder (e.g., `instagram-audio-downloader`)

2. **Enable Developer Mode in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Turn on "Developer mode" using the toggle in the top-right corner

3. **Load the Extension**
   - Click "Load unpacked" button
   - Select the folder containing the extension files
   - The extension should now appear in your extensions list

4. **Add Icons (Optional)**
   - The extension uses placeholder icons by default
   - You can add custom icons in PNG format to the `icons/` folder:
     - `icon16.png` (16x16 pixels)
     - `icon32.png` (32x32 pixels)
     - `icon48.png` (48x48 pixels)
     - `icon128.png` (128x128 pixels)

## 📋 Usage

1. **Open Instagram**
   - Navigate to [Instagram](https://instagram.com)
   - Go to your Direct Messages (DMs)

2. **Find Audio Messages**
   - Open a conversation that contains voice notes/audio messages
   - Look for the download button (📥) that appears next to audio messages

3. **Download Audio**
   - Click the download button next to any audio message
   - The audio file will be downloaded to your `Downloads/Instagram Audio/` folder
   - Files are automatically named with timestamps for easy organization

4. **Manage Extension**
   - Click the extension icon in your browser toolbar to:
     - Toggle the extension on/off
     - View download statistics
     - Access recent downloads
     - Get usage instructions

## ⚙️ Extension Controls

### Popup Interface
- **Status Toggle**: Enable/disable the extension
- **Statistics**: View total and session download counts
- **Recent Downloads**: See your latest downloaded files
- **Quick Access**: Direct link to Instagram DMs

### Right-click Menu
- Right-click on any Instagram page to quickly toggle the extension

## 🔧 Technical Details

### File Structure
```
insta-download/
├── manifest.json          # Extension configuration
├── content.js            # Main content script
├── background.js         # Service worker for downloads
├── injected.js          # Script for intercepting audio URLs
├── popup.html           # Extension popup interface
├── popup.js             # Popup functionality
├── popup.css            # Popup styling
├── styles.css           # Content script styling
├── icons/               # Extension icons
└── README.md            # This file
```

### How It Works

1. **Content Script**: Monitors Instagram pages for audio message elements
2. **URL Interception**: Captures audio file URLs using network request monitoring
3. **Download Management**: Uses Chrome's downloads API to save files
4. **UI Integration**: Adds download buttons that blend with Instagram's design

### Supported Audio Formats
- MP3 (MPEG Audio Layer 3)
- M4A (MPEG-4 Audio)
- WAV (Waveform Audio File Format)
- AAC (Advanced Audio Coding)
- OGG (Ogg Vorbis)
- OPUS (Opus Codec)

## 🛡️ Privacy & Security

- **Local Processing**: All processing happens locally in your browser
- **No Data Collection**: Extension doesn't collect or transmit personal data
- **Minimal Permissions**: Only requests necessary permissions for core functionality
- **Secure Downloads**: Uses Chrome's built-in download security features

## 🔍 Permissions Explained

The extension requires these permissions:

- **activeTab**: Access the currently active Instagram tab
- **downloads**: Download audio files to your computer
- **storage**: Save extension settings and statistics
- **host_permissions**: Access Instagram and related CDN domains for audio files

## 🐛 Troubleshooting

### Download Button Not Appearing
1. Refresh the Instagram page
2. Check if extension is enabled in the popup
3. Try opening a different conversation with audio messages
4. Clear browser cache and reload

### Downloads Not Starting
1. Check Chrome's download permissions
2. Ensure sufficient disk space
3. Try downloading a different audio message
4. Restart the browser and try again

### Audio Files Not Playing
1. Check if your system supports the audio format
2. Try playing in different audio software
3. Some Instagram audio files may have specific encoding

## 📝 Development

### Building from Source
1. Clone the repository
2. No build process required - it's a pure JavaScript extension
3. Load directly in Chrome using developer mode

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on Instagram
5. Submit a pull request

### Debugging
- Open Chrome DevTools on Instagram pages
- Check the Console tab for extension logs
- Use `chrome://extensions/` to view extension errors

## 📞 Support

If you encounter issues:

1. **Check Troubleshooting Section**: Most common issues are covered above
2. **Update Chrome**: Ensure you're using a recent version of Chrome
3. **Disable Conflicts**: Temporarily disable other Instagram-related extensions
4. **Clear Data**: Clear browser cache and extension storage

## ⚖️ Legal & Ethical Use

This extension is intended for personal use only. Please:

- Respect copyright and privacy laws
- Only download audio messages sent to you
- Use downloaded content responsibly
- Follow Instagram's Terms of Service
- Respect the privacy of others

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- Basic audio message detection and download
- Popup interface with statistics
- Support for multiple audio formats
- Chrome extension manifest v3

## 🚧 Known Limitations

- Only works on Instagram web (not mobile app)
- May not detect all audio message types immediately
- Requires Chrome browser (Chromium-based browsers may work)
- Instagram UI changes may temporarily affect functionality

## 🔮 Future Enhancements

- Batch download functionality
- Custom download locations
- Audio format conversion
- Improved Instagram layout compatibility
- Firefox extension support

---

**Disclaimer**: This extension is not affiliated with Meta/Instagram. Use responsibly and in accordance with Instagram's Terms of Service.