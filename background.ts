
// Added export {} to turn this file into a module and prevent global scope conflicts with other scripts declaring 'chrome'
export {};

// Chrome Extension Background Service Worker

// Declare chrome global for extension environment
declare const chrome: any;

chrome.runtime.onInstalled.addListener(() => {
  console.log('InstantApply Extension installed');
  
  // Set default side panel behavior
  if (chrome.sidePanel) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
      .catch((error) => console.error(error));
  }
});

// Listener for messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'GET_TAB_INFO') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      sendResponse({ tab: tabs[0] });
    });
    return true; // Keep channel open for async response
  }
});
