// Smart popup with incremental updates
const audioList = document.getElementById('audioList');
const renderedAudios = new Set(); // Track what's already rendered
let isInitialized = false;

// Initialize popup with existing audio
initializeAudioList();

// Listen for new audio from background
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'newAudioDetected') {
    addAudioElement(message.audioData);
  }
});

// Periodic check for new audio (fallback)
setInterval(() => {
  if (isInitialized) {
    checkForNewAudio();
  }
}, 3000);

async function initializeAudioList() {
  chrome.runtime.sendMessage({action: 'getDetectedAudio'}, (response) => {
    if (response?.audioFiles) {
      response.audioFiles.forEach(audio => {
        addAudioElement(audio);
      });
      isInitialized = true;
    }
  });
}

function addAudioElement(audioData) {
  // Skip if already rendered
  if (renderedAudios.has(audioData.id)) {
    console.log('Audio already rendered:', audioData.id);
    return;
  }
  
  console.log('Adding audio element:', audioData.url);

  const normalizedTimestamp = getTimestampValue(audioData.timestamp);
  
  const container = document.createElement('div');
  container.style.margin = '10px 0';
  container.dataset.timestamp = String(normalizedTimestamp);

  const timeLabel = document.createElement('div');
  timeLabel.textContent = formatTimestamp(audioData.timestamp);
  timeLabel.style.fontSize = '12px';
  timeLabel.style.color = '#888';
  timeLabel.style.marginBottom = '4px';

  const audioElement = document.createElement('audio');
  audioElement.controls = true;
  audioElement.src = audioData.url;
  audioElement.id = 'audio_' + audioData.id;
  audioElement.style.display = 'block';
  audioElement.style.margin = '0 0 4px 0';

  container.appendChild(timeLabel);
  container.appendChild(audioElement);

  const insertionTarget = findInsertionTarget(normalizedTimestamp);
  if (insertionTarget) {
    audioList.insertBefore(container, insertionTarget);
  } else {
    audioList.appendChild(container);
  }
  
  // Mark as rendered
  renderedAudios.add(audioData.id);
  
  console.log('Total rendered audios:', renderedAudios.size);
}

function checkForNewAudio() {
  chrome.runtime.sendMessage({action: 'getDetectedAudio'}, (response) => {
    if (response?.audioFiles) {
      response.audioFiles.forEach(audio => {
        if (!renderedAudios.has(audio.id)) {
          addAudioElement(audio);
        }
      });
    }
  });
}

function formatTimestamp(ts) {
  if (!ts) return 'Time unknown';
  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) return 'Time unknown';
  return date.toLocaleString();
}

function getTimestampValue(ts) {
  if (!ts) return Number.POSITIVE_INFINITY;
  const parsed = new Date(ts);
  const value = parsed.getTime();
  return Number.isNaN(value) ? Number.POSITIVE_INFINITY : value;
}

function findInsertionTarget(timestampValue) {
  if (!audioList?.children?.length) return null;
  for (const child of audioList.children) {
    const childTimestamp = Number(child.dataset.timestamp ?? Number.POSITIVE_INFINITY);
    if (timestampValue < childTimestamp) {
      return child;
    }
  }
  return null;
}