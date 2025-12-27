// Simple audio detection with persistent storage
// Key the map by timestamp-based ID so identical clips do not duplicate
const audioFiles = new Map();
const audioFilesByUrl = new Map();

// Load existing audio from storage on startup
chrome.storage.local.get(['detectedAudio']).then((result) => {
  if (result.detectedAudio) {
    result.detectedAudio.forEach((audio) => {
      registerAudio(audio);
    });
  }
});

chrome.webRequest.onCompleted.addListener(
  (details) => {
    const url = details.url;
    if (url.includes('audioclip') || url.includes('audio_clip') || url.includes('.wav') || url.includes('.mp3') || url.includes('.m4a')) {
      const timestamp = extractTimestamp(url) || Date.now();
      const id = String(timestamp);
      
      console.log('Audio detected:', url);
      console.log('Generated ID:', id);
      
      // Only add if this timestamp not already tracked
      if (!audioFiles.has(id)) {
        const audioData = registerAudio({id, url, timestamp});
        
        console.log('Audio added to map. Total count:', audioFiles.size);
        
        // Save to storage
        saveAudioToStorage();
        
        // Notify popup if it's open
        notifyPopupNewAudio(audioData);
      } else {
        console.log('Audio already exists with timestamp:', id);
      }
    }
  },
  {urls: ["*://www.instagram.com/*", "*://www.messenger.com/*", "*://cdn.fbsbx.com/*", "*://*.fbcdn.net/*"]},
  ["responseHeaders"]
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getDetectedAudio') {
    const audioArray = Array.from(audioFiles.values()).sort((a, b) => a.timestamp - b.timestamp);
    sendResponse({success: true, audioFiles: audioArray});
  }
});

chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
  const audioData = audioFilesByUrl.get(item.url);
  if (!audioData) {
    suggest();
    return;
  }

  const filename = buildFilenameForAudio(audioData, item);
  if (!filename) {
    suggest();
    return;
  }

  suggest({filename, conflictAction: 'uniquify'});
});

function registerAudio(rawAudio) {
  if (!rawAudio || !rawAudio.url) return null;
  const url = rawAudio.url;
  const extractedTs = extractTimestamp(url);
  const timestamp = extractedTs || rawAudio.timestamp || Date.now();
  const idSource = rawAudio.id || extractedTs || timestamp;
  if (!idSource) return null;
  const id = String(idSource);

  const normalized = {id, url, timestamp};
  audioFiles.set(id, normalized);
  audioFilesByUrl.set(url, normalized);
  return normalized;
}

function extractTimestamp(url) {
  if (!url) return null;
  const match = url.match(/audioclip-(\d+)-/);
  if (!match) return null;
  const ts = Number(match[1]);
  return Number.isFinite(ts) ? ts : null;
}

function buildFilenameForAudio(audioData, downloadItem) {
  if (!audioData) return null;
  const date = new Date(audioData.timestamp);
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;
  const timestampLabel = formatHumanReadableTimestamp(safeDate);
  const baseName = `Instagram-audio-${timestampLabel}`;
  const extension = resolveExtension(downloadItem?.filename || downloadItem?.suggestedFilename || audioData.url);
  return `Instagram Audio/${baseName}${extension}`;
}

function formatHumanReadableTimestamp(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const offsetMinutes = date.getTimezoneOffset();
  const sign = offsetMinutes <= 0 ? '+' : '-';
  const offsetAbs = Math.abs(offsetMinutes);
  const offsetHours = String(Math.floor(offsetAbs / 60)).padStart(2, '0');
  const offsetMins = String(offsetAbs % 60).padStart(2, '0');
  const tz = `GMT${sign}${offsetHours}${offsetMins}`;
  return `${year}-${month}-${day} ${hours}-${minutes}-${seconds} ${tz}`;
}

function resolveExtension(source) {
  return '.mp4';
}

// Save audio list to storage
async function saveAudioToStorage() {
  const audioArray = Array.from(audioFiles.values());
  await chrome.storage.local.set({detectedAudio: audioArray});
}

// Notify popup of new audio
async function notifyPopupNewAudio(audioData) {
  try {
    const tabs = await chrome.tabs.query({active: true, currentWindow: true});
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {
        action: 'newAudioDetected',
        audioData: audioData
      }).catch(() => {});
    });
    
    // Also try to send to popup if it exists
    chrome.runtime.sendMessage({
      action: 'newAudioDetected',
      audioData: audioData
    }).catch(() => {});
  } catch (error) {
    // Ignore errors
  }
}