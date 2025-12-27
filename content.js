// Content script for Instagram Audio Downloader - Simple message relay
class AudioMessageRelay {
  constructor() {
    this.init();
  }

  init() {
    this.setupMessageListeners();
    console.log('Instagram Audio Downloader: Content script ready');
  }

  setupMessageListeners() {
    // Listen for messages from background script about detected audio
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'audioDetected') {
        // Audio was detected via web request monitoring
        console.log('Audio detected:', request.audioData.filename);
        sendResponse({status: 'received'});
        return true;
      }
    });
  }
}

// Initialize message relay
new AudioMessageRelay();