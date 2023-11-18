import resemble from 'resemblejs';

// communicate with popup with chrome.runtime.sendMessage

let prev = null; 
let curr = null; 
let diff = null; 
let percent = 0; 
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
function takeScreenshot() {
	if (percent > 0) return; 
  
	chrome.runtime.sendMessage({ type: 'screenshot request'})

	if (onTab) {
		setTimeout(() => takeScreenshot(), 1000);
	}
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
				percent = data.rawMisMatchPercentage
				diff = data.getImageDataUrl()
      });
  } 
}

function sendDiffReport() {
  chrome.runtime.sendMessage({
    type: 'diff report',
    percent: percent
  });
}

// Listen for visibility change events
document.addEventListener('visibilitychange', function() {
  // Check if the page is hidden
  onTab = !document.hidden;

  if (onTab) {
    console.log('hi')
    takeScreenshot();
		calculateDiff();
		if (percent > 0) {
			console.log('mismatch:', percent)
			sendDiffReport()
			const diffImg = getDiffImg()
			diffImg.src = diff
		}
  } else {
    console.log('bye')
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.type === 'clear') {
		const img = getDiffImg()
		percent = 0
    diff = null;
    img.src = '';
		takeScreenshot();
  } else if (request.type === 'screenshot response') {
		prev = curr; 
		curr = request.data;
	}
});

window.onload = () => takeScreenshot();
document.onload = () => takeScreenshot();
