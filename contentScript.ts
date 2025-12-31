
// Added export {} to turn this file into a module and prevent global scope conflicts with other scripts declaring 'chrome'
export {};

/**
 * InstantApply Content Script
 * Scans the current page for labels and inputs to assist the user.
 */

// Declare chrome global for extension environment
declare const chrome: any;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'SCRAPE_FORM_CONTEXT') {
    const labels = Array.from(document.querySelectorAll('label, h1, h2, h3, p'))
      .map(el => el.textContent?.trim())
      .filter(text => text && text.length > 3 && text.length < 200)
      .slice(0, 20); // Get first 20 likely questions
      
    const inputs = Array.from(document.querySelectorAll('input, textarea'))
      .map(input => (input as HTMLInputElement).placeholder || (input as HTMLInputElement).name)
      .filter(Boolean);

    sendResponse({ 
      title: document.title,
      context: labels.join('\n'),
      inputs: inputs
    });
  }
});
