import React, { useEffect, useState } from "react"
import './Popup.css';

// communicate with content with chrome.tabs.sendMessage

const Popup = () => {
  const [mismatch, setMismatch] = useState(0)
  const [tabId, setTabId] = useState('')

  function clearDiff() {
    setMismatch(0);
    chrome.tabs.sendMessage(tabId, { type: 'clear' });
  }

  useEffect(() => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      setTabId(tabs[0].id);
    });
  }, []);

  useEffect(() => {
    chrome.action.setBadgeText({ text: Math.floor(mismatch).toString() });
  }, [mismatch]);
    
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'diff report') {
      // Update the state with the received diff report
      setMismatch(request.percent)
    }
  });
  
  return (
    <>
      <ul style={{ minWidth: "700px" }}>
        <li>Current mismatch: {mismatch}</li>
      </ul>
      <button onClick={() => clearDiff()}>clear diff</button>
    </>
  )
}

export default Popup;