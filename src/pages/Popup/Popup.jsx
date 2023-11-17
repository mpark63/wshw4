import React, { useEffect, useState } from "react"
import './Popup.css';

const Popup = () => {
  const [diffPercent, setDiffPercent] = useState(localStorage.getItem('diffPercent') || '')
  const [diffImg, setDiffImg] = useState(localStorage.getItem('diff') || '')
    
  useEffect(() => {
    chrome.action.setBadgeText({ text: diffPercent })
  }, [diffPercent])

  useEffect(() => {
    // GOAL: RESPOND TO DIFF REPORT AND UPDATE POPUP
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // popup to background script
      chrome.runtime.sendMessage({ tabId: tabs[0].id,  type: 'start' });
    });
  
    chrome.runtime.onMessage.addListener(function (request) {
      if (request.type === 'diff report') {
        setDiffPercent(localStorage.getItem('diffPercent'))
        setDiffImg(localStorage.getItem('diffImg'))
      }
    });
  },[])
  
  return (
    <>
      <ul style={{ minWidth: "700px" }}>
        <li>Mismatch percentage: {diffPercent}</li>
      </ul>
      <img src={diffImg} height="400" alt="diff"/>
    </>
  )
}

export default Popup;