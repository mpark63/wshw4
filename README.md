## Setup 
To build dependencies and compile the extension, run the following lines in the terminal: 
```
npm install 
npm run build
```

Proceed to `chrome://extensions` and click on the `Load unpacked` button. Choose the build folder. 

## How it works 
This repository is a clone of `https://github.com/lxieyang/chrome-extension-boilerplate-react`, which is boilerplate code to write chrome extension components such as the popup in ReactJS. I think it compiles with webpack. 

There are three main scripts in use. 
### `src/pages/Popup/Popup.jsx`
Popup.jsx contains the html and state for the popup that appears when you click on the extension icon. The icon includes a small number label which indicates the mismatch since you last saw the image. The popup includes a longer decimal number for the mismatch and a button to reset. That is, remove the red overlay and set mismatch back to 0. 

### `src/pages/Content/index.js`
Rhe content script start calling the `takeScreenshot` function as soon as the page loads. The `takeScreenshot` function calls itself recursively every second. Also, this script detects the page visibility by subscribing to the `visibilitychange` event. If the user leaves a page and comes back, we take a new screenshot and take the difference to see if there's been any changes. If there's a mismatch greater than 0, we stop capturing screenshots and display the UI changes in an <img> element laid on top of the page. We use resemblejs to compare the most recent and second most recent screenshots. The mismatch percentage is shown in the popup. It communicates bidirectionally with the popup using `chrome.runtime`. The content script sends `diff report` messages, which contains the latest mismatch statistic. The popup emits `clear` messages, which tells content to clear the mismatch states and start screenshoting again. 

### `src/pages/Background/index.js`
This is a script that communicates with the content script. Upon receiving the `screenshot request` message from content script, it emits a `screenshot response` with the result of `chrome.tabs.captureVisibleTab`. 

## Examples
TBD