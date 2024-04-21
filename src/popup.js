'use strict';

document.addEventListener('DOMContentLoaded', function () {

  function getEmail() {
    chrome.runtime.sendMessage({ action: "get_email" }, function (response) {
      console.log(response.email);
      document.getElementById('user').innerHTML = response.email;
    });
  }
  getEmail();


  document.addEventListener('keydown', function (event) {
    console.log("space key pressed");
    console.log(event.code);
    if (event.code === 'Space') {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "start" }, function (response) {
          console.log(response);
        });
        console.log('msg sent');
      });
    }
  });

});