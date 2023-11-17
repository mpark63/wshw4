import resemble from 'resemblejs';

// GOAL: RESPOND TO NEW SCREENSHOT BY TAKING DIFF 

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

chrome.runtime.onMessage.addListener(function (req, sender, res) {
	console.log('hello from screenshot listener')
  if (req.type === 'screenshot') {
		console.log('screenshot received')
    const prev = localStorage.getItem('diffImg') || null;
		let curr = req.curr; 
		localStorage.setItem('diffImg', curr);
		resemble(prev)
			.compareTo(curr)
			.onComplete(async function (respData) {
				localStorage.setItem('diffImg', respData.getImageDataUrl());
				localStorage.setItem('diffPercent', respData.misMatchPercentage);

				// content script to popup 
				chrome.runtime.sendMessage({ type: 'diff report'});
				console.log('diff report sent')
			});
  }
})
