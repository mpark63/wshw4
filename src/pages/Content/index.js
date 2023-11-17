import resemble from 'resemblejs';
import html2canvas from 'html2canvas';

// communicate with popup with chrome.runtime.sendMessage

let prev = null; 
let curr = null; 
let diff = null; 

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
      img.src = diff
      showDiff()
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
function showDiff() {
  let img = getDiffImg()

  if (prev === null && curr === null) {
    console.log('err: no screenshot taken yet')
    setTimeout(() => takeScreenshot(), 3000)
  } else if (prev === null && curr !== null) {
    console.log('first screenshot')
    img.src = curr
    setTimeout(() => takeScreenshot(), 3000)
  } else {
    console.log('difference taken')
    resemble(prev)
      .compareTo(curr)
      .onComplete(async function (respData) {
        diff = respData.getImageDataUrl();
        img.src = diff
        setTimeout(() => takeScreenshot(), 3000)
      });
  }
}

window.onfocus = takeScreenshot;
