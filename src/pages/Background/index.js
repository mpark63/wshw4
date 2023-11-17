console.log('This is the background page.');
console.log('Put the background scripts here.');

chrome.runtime.onInstalled.addListener(startScreenshotInterval);

function startScreenshotInterval() {
  setInterval(() => takeScreenshot(), 3000); // 3 seconds interval
}

function takeScreenshot() {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    let tabId = tabs[0].id;
    // Send screenshotUrl to the tab.
    chrome.tabs.captureVisibleTab({ format: "jpeg", quality: 80 }).then((res) => {
      chrome.tabs.sendMessage(tabId, { type: 'screenshot', data: res })
    })
  });
}
