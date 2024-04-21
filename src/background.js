'use strict';
let email;

const GMAIL_ORIGIN = 'https://mail.google.com';


// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) return;
  const url = new URL(tab.url);
  // Enables the side panel on google.com
  if (url.origin === GMAIL_ORIGIN) {
    await chrome.sidePanel.setOptions({
      tabId,
      path: 'popup.html',
      enabled: true
    });
  } else {
    // Disables the side panel on all other sites
    await chrome.sidePanel.setOptions({
      tabId,
      enabled: false
    });
  }
});

chrome.identity.getProfileUserInfo(function (info) {
  email = info.email;
  console.log(email);
});

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.action === "send_body_blob") {
    const tabId = sender.tab.id;
    chrome.tabs.sendMessage(tabId, { action: "receive_body_blob", blob: request.blob });
  } else if (request.action === "get_email") {
    sendResponse({ email: email });
  }
});

chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === 'install') {
    openWebPage();
  }
});

function openWebPage() {
  chrome.tabs.create({ url: 'https://eyes-free-efa6c.web.app/' });
}
