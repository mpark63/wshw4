import React, { useEffect, useState } from "react"
import './Popup.css';

// communicate with content with chrome.tabs.sendMessage

const Popup = () => {
  const [mismatch, setMismatch] = useState('0')
  const [currentDiff, setCurrentDiff] = useState('')
    
  useEffect(() => {
    chrome.runtime.sendMessage({
      type: 'popup',
      keyword: 'please'
    });

    chrome.runtime.onMessage.addListener((response, sender, sendResponse) => {
      if (response.type === 'diff report') {
        // Update the state with the received diff report
        console.log('received diff report')
        setMismatch(response.percentage);
        setCurrentDiff(response.img);
        chrome.action.setBadgeText({ text: mismatch });
      }
    });
  }, [])
  
  return (
    <>
      <ul style={{ minWidth: "700px" }}>
        <li>Current mismatch: {mismatch}</li>
      </ul>
      <p>Screenshot:</p>
      <img src={currentDiff} height="400" alt="diff"/>
    </>
  )
}

export default Popup;