console.log('This is the background page.');
console.log('Put the background scripts here.');

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'screenshot request') {
    chrome.tabs.captureVisibleTab({ format: "jpeg", quality: 80 }).then((res) => {
      console.log(sender.tab.id)
      chrome.tabs.sendMessage(sender.tab.id, { type: 'screenshot response', data: res })
    })
  }
});