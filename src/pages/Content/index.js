import resemble from 'resemblejs';
import html2canvas from 'html2canvas';

// communicate with popup with chrome.runtime.sendMessage

let prev = null; 
let curr = null; 
let diff = null; 
let diffData = { misMatchPercentage: '?', img: null }; 
let onTab = true; 

// set resemble settings for diff in red 
resemble.outputSettings({
  errorColor: {
      red: 220,
      green: 20,
      blue: 0
  },
  errorType: "movement",
  transparency: 0.3,
  largeImageThreshold: 1200,
  useCrossOrigin: false,
});

// take a screenshot of current tab 
export const takeScreenshot = () => {
  // del prev diff 
  let img = getDiffImg()
  img.src = ''
  
  prev = curr; 
  // chrome.tabs.captureVisibleTab({ format: "jpeg", quality: 80 }).then((res) => {
  //   curr = res;
  //   showDiff()
  // })
  html2canvas(document.body, { allowTaint: true, foreignObjectRendering: true })
    .then((res) => {
      curr = res.toDataURL('image/png');
      if (prev === null && curr !== null) console.log('first screenshot taken')
      calculateDiff()
      if (onTab) setTimeout(() => takeScreenshot(), 3000)
    })
    .catch((err) => console.log(err)); 
}

function getDiffImg() {
  let img = document.getElementById('diff')

  if (!img) {
    img = document.createElement('img')
    img.id = 'diff'
    img.style.width = '100%'
    img.style.position = 'absolute'
    img.style.pointerEvents = 'none'
    img.style.top = '0'
    img.style.left = '0'
    img.crossorigin = "anonymous"
    document.body.appendChild(img)
  }

  return img
}

// change html in response to message 
function calculateDiff() {
  if (prev === null && curr === null) {
    console.log('err: no screenshot taken yet')
  } else if (prev !== null && curr !== null) {
    resemble(prev)
    .compareTo(curr)
    .onComplete(async function (data) {
        diffData = data; 
        diff = data.getImageDataUrl();
        // setTimeout(() => takeScreenshot(), 3000)
      });
  } 
}

export function sendDiffReport() {
  chrome.runtime.sendMessage({
    type: 'diff report',
    percentage: diffData.misMatchPercentage,
    img: diff
  });
}

function openNewTab() {
  console.log('opening new tab')
  const viewTabUrl = chrome.runtime.getURL('newtab.html');
  let targetId = null;
  chrome.action.onClicked.addListener(async function () {

    chrome.tabs.onUpdated.addListener(function listener(tabId, changedProps) {
      // We are waiting for the tab we opened to finish loading.
      // Check that the tab's id matches the tab we opened,
      // and that the tab is done loading.
      if (tabId !== targetId || changedProps.status !== 'complete') return;

      // Passing the above test means this is the event we were waiting for.
      // There is nothing we need to do for future onUpdated events, so we
      // use removeListner to stop getting called when onUpdated events fire.
      chrome.tabs.onUpdated.removeListener(listener);

      // Send screenshotUrl to the tab.
      chrome.tabs.sendMessage(tabId, { msg: 'screenshot', data: diff });
    });

    const tab = await chrome.tabs.create({ url: viewTabUrl });
    targetId = tab.id;
  })
}


// Listen for visibility change events
document.addEventListener('visibilitychange', function() {
  // Check if the page is hidden
  onTab = !document.hidden;

  if (onTab) {
    console.log('hi')
    takeScreenshot();

    if (diffData !== null) {
      // alert to popup 
      console.log(diffData)
      sendDiffReport()
      console.log('before openNewTab')
      openNewTab()
      console.log('after openNewTab')
    }
  } else {
    console.log('bye')
  }
});

window.onfocus = takeScreenshot;
