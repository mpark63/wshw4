import React, { useEffect, useState } from "react"
import './Popup.css';

// communicate with content with chrome.tabs.sendMessage

const Popup = () => {
  const [count, setCount] = useState(42)
  const [currentDiff, setCurrentDiff] = useState('')
  const [currentURL, setCurrentURL] = useState()
  const [currentId, setCurrentId] = useState()
    
  useEffect(() => {
    chrome.action.setBadgeText({ text: count.toString() })
  }, [count])
  
  return (
    <>
      <ul style={{ minWidth: "700px" }}>
        <li>Current URL: {currentURL}</li>
        <li>Current Time: {new Date().toLocaleTimeString()}</li>
      </ul>
      <p>Screenshot: {currentId} </p>
      <img src={currentDiff} height="400" alt="diff"/>
    </>
  )
}

export default Popup;