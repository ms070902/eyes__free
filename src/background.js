'use strict';
//var serverhost = 'http://127.0.0.1:8000';
//
//	chrome.runtime.onMessage.addListener(
//		function(request, sender, sendResponse) {
//
//
//			var url = serverhost + '/'+ encodeURIComponent(request.option) ;
//
//			console.log(url);
//
//			//var url = "http://127.0.0.1:8000/wiki/get_wiki_summary/?topic=%22COVID19%22"
//			fetch(url)
//			.then(response => response.json())
//			.then(response => sendResponse({farewell: response}))
//			.catch(error => console.log(
//			error))
//
//			return true;  // Will respond asynchronously.
//
//	});
let email;

const GOOGLE_ORIGIN = 'https://mail.google.com';


// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) return;
  const url = new URL(tab.url);
  // Enables the side panel on google.com
  if (url.origin === GOOGLE_ORIGIN) {
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

chrome.identity.getProfileUserInfo(function(info) {
  email = info.email;
  console.log(email);
});

chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
  if(request.action === "send_body_blob") {
    const tabId = sender.tab.id;
    chrome.tabs.sendMessage(tabId, {action: "receive_body_blob", blob : request.blob});
  } else if(request.action === "get_email"){
    sendResponse({email : email});
  }
});

// setTimeout(() => {
//   navigator.mediaDevices.getUserMedia({ audio: true })
//   .catch(function() {
//       chrome.tabs.create({
//           url: chrome.extension.getURL("popup.html"),
//           selected: true
//       })
//   });
// }, 100);