// Injected script to intercept audio URLs in Instagram page context
(function() {
  'use strict';
  
  // Override XMLHttpRequest to intercept audio requests
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;
  const originalFetch = window.fetch;

  // Store audio URLs
  const audioUrls = new Set();

  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    this._url = url;
    return originalXHROpen.call(this, method, url, ...args);
  };

  XMLHttpRequest.prototype.send = function(data) {
    const url = this._url;
    
    this.addEventListener('load', function() {
      if (url && isAudioUrl(url) && this.status === 200) {
        console.log('Audio URL intercepted via XHR:', url);
        audioUrls.add(url);
        window.postMessage({
          type: 'AUDIO_URL_FOUND',
          url: url,
          method: 'XHR'
        }, '*');
      }
    });
    
    return originalXHRSend.call(this, data);
  };

  // Override fetch
  window.fetch = function(url, options = {}) {
    if (isAudioUrl(url)) {
      console.log('Audio URL intercepted via fetch:', url);
      audioUrls.add(url);
      window.postMessage({
        type: 'AUDIO_URL_FOUND',
        url: url,
        method: 'fetch'
      }, '*');
    }
    
    return originalFetch(url, options);
  };

  // Override audio element creation
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName) {
    const element = originalCreateElement.call(this, tagName);
    
    if (tagName.toLowerCase() === 'audio') {
      // Monitor src changes
      Object.defineProperty(element, 'src', {
        set: function(value) {
          if (value && isAudioUrl(value)) {
            console.log('Audio URL set on audio element:', value);
            audioUrls.add(value);
            window.postMessage({
              type: 'AUDIO_URL_FOUND',
              url: value,
              method: 'audio_element'
            }, '*');
          }
          this.setAttribute('src', value);
        },
        get: function() {
          return this.getAttribute('src');
        }
      });
    }
    
    return element;
  };

  // Monitor audio element src attribute changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
        const target = mutation.target;
        if (target.tagName === 'AUDIO' && target.src) {
          const url = target.src;
          if (isAudioUrl(url)) {
            console.log('Audio URL detected in mutation:', url);
            audioUrls.add(url);
            window.postMessage({
              type: 'AUDIO_URL_FOUND',
              url: url,
              method: 'mutation'
            }, '*');
          }
        }
      }
    });
  });

  observer.observe(document, {
    attributes: true,
    subtree: true,
    attributeFilter: ['src']
  });

  function isAudioUrl(url) {
    if (!url || typeof url !== 'string') return false;
    
    const audioExtensions = ['.mp3', '.m4a', '.wav', '.aac', '.ogg', '.opus', '.mp4'];
    const audioIndicators = [
      'audio',
      'voice',
      'sound',
      '/a/', // Instagram audio path pattern
      'fbcdn.net', // Facebook CDN
      'cdninstagram.com'
    ];
    
    const lowerUrl = url.toLowerCase();
    
    // Check for audio file extensions
    if (audioExtensions.some(ext => lowerUrl.includes(ext))) {
      return true;
    }
    
    // Check for audio indicators in URL
    if (audioIndicators.some(indicator => lowerUrl.includes(indicator))) {
      return true;
    }
    
    return false;
  }

  // Expose function to get latest audio URLs
  window.getLatestAudioUrls = function() {
    return Array.from(audioUrls);
  };

  // Clean old URLs periodically
  setInterval(() => {
    if (audioUrls.size > 50) {
      const urlArray = Array.from(audioUrls);
      audioUrls.clear();
      // Keep only the last 10
      urlArray.slice(-10).forEach(url => audioUrls.add(url));
    }
  }, 60000);

  console.log('Instagram Audio Interceptor injected successfully');
})();