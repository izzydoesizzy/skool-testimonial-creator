// popup.js
// This script runs inside the extension popup. It wires up the buttons
// in popup.html to send messages to the content script in the active tab.

/**
 * Helper to send a message to the active tab's content script.
 * @param {Object} message The message object.
 */
function sendMessageToActiveTab(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0] && tabs[0].id;
    if (tabId !== undefined) {
      chrome.tabs.sendMessage(tabId, message);
    }
  });
}

document.getElementById('testimonialButton').addEventListener('click', () => {
  sendMessageToActiveTab({ type: 'setMode', mode: 'testimonial' });
});

document.getElementById('memberButton').addEventListener('click', () => {
  sendMessageToActiveTab({ type: 'setMode', mode: 'member' });
});

document.getElementById('disableButton').addEventListener('click', () => {
  sendMessageToActiveTab({ type: 'setMode', mode: null });
});

document.getElementById('editorButton').addEventListener('click', () => {
  // Open the editor page in a new tab
  chrome.tabs.create({ url: chrome.runtime.getURL('editor.html') });
});

document.getElementById('clearButton').addEventListener('click', () => {
  sendMessageToActiveTab({ type: 'clearSelected' });
});