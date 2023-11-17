// GOAL: TAKE SCREENSHOTS OFTEN 

console.log('hello from background')

function takeScreenshot(sender) {
  console.log('hello from takeScreenshot')
  chrome.tabs.captureVisibleTab({ format: 'jpeg', quality: 80 }).then((res) => {
    console.log(sender.tab.id);
    // Sending a message from a background script to a content script in a specific tab
    chrome.tabs.sendMessage(sender.tab.id, { type: 'screenshot', curr: res });
    console.log('Screenshot sent');
    setTimeout(() => takeScreenshot(), 3000); // 3 seconds interval
  });
}

chrome.runtime.onMessage(takeScreenshot)
