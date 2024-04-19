'use strict';




document.addEventListener('DOMContentLoaded', function () {
  // const startButton = document.getElementById('start');
  // const stopButton = document.getElementById('stop');
  // const speakButton = document.getElementById('speak');
  // const recordButton = document.getElementById('startAudioRecording');
  // const stopRecordingButton = document.getElementById('stopAudioRecording');
  // const up  = document.getElementById('upload');
  // const mic = document.getElementById('mic');

  
  function getEmail () {
    chrome.runtime.sendMessage({ action: "get_email" }, function (response) {
      console.log(response.email);
      document.getElementById('user').innerHTML = response.email;
    });
  }
  getEmail();
  
  


  // document.addEventListener('click', function () {
  //     navigator.mediaDevices.getUserMedia({audio: true});
  //     if (annyang) {

  //         // Add our commands to annyang
  //         annyang.addCommands(commands);

  //         // Start listening.
  //         annyang.start();
  //         console.log('annyang loaded');
  //     }
  // })

//   document.addEventListener('click', function () {
//       chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//           chrome.tabs.sendMessage(tabs[0].id, { action : "start" }, function (response) {
//               console.log(response);
//           });
//           console.log('msg sent');
//       });
//   });

  document.addEventListener('keydown', function (event) {
    console.log("space key pressed");
    console.log(event.code);
    if(event.code === 'Space') {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action : "start" }, function (response) {
                console.log(response);
            });
            console.log('msg sent');
        });
    }
});


  // startButton.addEventListener('click', function(){
  //     console.log('sending msg');
  //     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //         chrome.tabs.sendMessage(tabs[0].id, {data: "start"}, function(response) {
  //             console.log(response);
  //         });
  //         console.log('msg sent');
  //     });
  // });

  // stopButton.addEventListener('click', function () {
  //     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //         chrome.tabs.sendMessage(tabs[0].id, {data: "stop"}, function(response) {});
  //     });
  // });

  // speakButton.addEventListener('click', function() {
  //     // console.log(inputText.textContent);
  //     textToSpeech();
  // });

  // recordButton.addEventListener('click', function () {
  //     console.log("clicked");
  //     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //         chrome.tabs.sendMessage(tabs[0].id, {action: "record"}, function(response){});
  //         console.log("msg sent");
  //     });
  // });

  // stopRecordingButton.addEventListener('click', function () {
  //     console.log('clicked');
  //     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //         chrome.tabs.sendMessage(tabs[0].id, {action: "stop"}, function(response){});
  //         console.log("msg sent");
  //     });
  // });

  // up.addEventListener('click', function() {
  //     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //         chrome.tabs.sendMessage(tabs[0].id, {action: "upload"}, function(response){});
  //         console.log("msg sent");
  //     });
  // })

  // h.addEventListener('click', function(){
  //     console.log('clicked');
  //     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //         chrome.tabs.sendMessage(tabs[0].id, {data: "hi"}, function(response){});
  //         console.log("msg sent");
  //     });
  // });

  // chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  //     if (request.error){
  //         // errorMessage.textContent = request.error
  //         console.log(request.error);
  //     }
  // });

  // console.log('initialising');
  // speechRecognition.start();
});

// const textToSpeech = () => {
//     chrome.tts.speak("Hello world");
// }

// document.addEventListener('DOMContentLoaded', function () {
//     // Check if annyang is available
//     if (annyang) {
//         // Add click event listener to start annyang
//         document.addEventListener('click', startAnnyang);
//     } else {
//         console.error('Annyang not available');
//     }
// });

