'use strict';

import FileSaver from 'file-saver'
import fixWebmDuration from "fix-webm-duration";

var recognition, div, languageSelected, isStopButtonClicked = false;
let lastTranscript, interimTranscript, finalTranscript;
var mediaRecorder;
var audioChunks = [];
var transcript;
let userEmail;
let body = '';

let apiUrl = "https://c509-2401-4900-56fb-5162-805d-5c70-a7a5-bed4.ngrok-free.app/"

chrome.runtime.sendMessage({ action: "get_email" }, function (response) {
  userEmail = response.email;
});

// const init = () => {
//   div = document.createElement('div');
//   div.className = 'live-caption';

//   setDivStyle(div);

//   recognition = new webkitSpeechRecognition();
//   recognition.continuous = true;
//   recognition.interimResults = true;
//   recognition.lang = languageSelected || "en-US";

//   recognition.onresult = event => {
//     let last = event.results.length - 1;
//     lastTranscript = event.results[last][0].transcript;
//     interimTranscript = '';
//     finalTranscript = '';

//     for (var i = event.resultIndex; i < event.results.length; ++i) {
//         // Verify if the recognized text is the last with the isFinal property
//       if (event.results[i].isFinal) {
//         finalTranscript += event.results[i][0].transcript;
//       } else {
//         interimTranscript += event.results[i][0].transcript;
//       }
//     }

//     div.textContent = interim_transcript;
//     document.body.appendChild(div);

//     if(lastTranscript === "done"){
//       recognition.stop();
//     }
//   }

//   recognition.onerror = event => {
//     console.log("error", event.error)
//     if(event.error === 'not-allowed'){
//       const errorMessage = "AudioCapture permission has been blocked because of a Feature Policy applied to the current document. See https://goo.gl/EuHzyv for more details.";
//       chrome.runtime.sendMessage({error: errorMessage})
//       isStopButtonClicked = true;
//       recognition.stop();
//     }
//   }

//   recognition.onspeechstart = event => console.log("speech started");
//   recognition.onspeechend = event => lastTranscript = "";
//   recognition.onend = function(event) {
//     recognition.start();
//   }

//   recognition.start();
// }

// // const startTracking = () => recognition.start();

// const setDivStyle = div => {
//   div.style.bottom = '10px';
//   div.style.left = 0;
//   div.style.textAlign = 'center';
//   div.style.backgroundColor = 'rgba(0,0,0,0.8)';
//   div.style.position = 'absolute';
//   div.style.color = 'white';
//   div.style.padding = '10px';
//   div.style.fontSize = '30px';
//   div.style.width = '50%';
//   div.style.transform = 'translate(50%)';
//   div.style.border = '2px solid white';
//   div.style.borderRadius = "5px";
//   div.style.zIndex= "10000";
//   div.style.fontFamily = "Arial";
// }

// // const stopTracking = () => {
// //   // if(lastTranscript !== ""){
// //   //   recognition.stop();
// //   // } else {
// //   //   recognition.stop();
// //   //   recognition.start();
// //   // }
// //   recognition.stop();
// //   if(document.body.contains(div)){
// //     document.body.removeChild(div);
// //   }
// // }
// let capturedStream = null;

let duration;
let startTime;


const recordAudio = async () => {
  playsound("speak");
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (stream) {
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];
      mediaRecorder.ondataavailable = function (event) {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = function () {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);

        // For testing purposes, log the audio URL
        console.log('Audio URL:', audioUrl);
      };

      mediaRecorder.start();
      startTime = Date.now();
    })
    .catch(function (error) {
      console.error('Error accessing microphone:', error);
    });
  // try {
  //   const stream = await navigator.mediaDevices.getUserMedia({
  //     audio: {
  //       echoCancellation: true,
  //     }
  //   });
  //   audioChunks = [];
  //   capturedStream = stream;

  //   // Use the extended MediaRecorder library
  //   mediaRecorder = new MediaRecorder(stream, {
  //     mimeType: 'audio/wav'
  //   });

  //   // Add audio blobs while recording 
  //   mediaRecorder.addEventListener('dataavailable', event => {
  //     audioChunks.push(event.data);
  //   });

  //   mediaRecorder.start();
  // } catch (e) {
  //   console.error(e);
  // }
}


// function stopRecording() {
//   return new Promise(resolve => {
//     if (!mediaRecorder) {
//       resolve(null);
//       return;
//     }

//     mediaRecorder.addEventListener('stop', () => {
//       const mimeType = mediaRecorder.mimeType;
//       const audioBlob = new Blob(audioChunks, { type: mimeType });

//       if (capturedStream) {
//         capturedStream.getTracks().forEach(track => track.stop());
//       }

//       resolve(audioBlob);
//     });

//     mediaRecorder.stop();

//   });
// }




const stopRecording = () => {
  // playsound("stopped");
  // let audioBlob = null;
  // navigator.mediaDevices.getUserMedia({ audio: true })
  //   .then(function (stream) {


  //     mediaRecorder.onstop = async function () {
  //       audioBlob = new Blob(audChunks, { type: 'audio/wav' });
  //       const audioUrl = URL.createObjectURL(audioBlob);

  //       // audioElement = new Audio(audioUrl);
  //       // audioElement.play();

  //       // audioElement.addEventListener('canplaythrough', function() {
  //       //   startTracking();
  //       // });

  //       // recognition.start(audioBlob);
  //       // console.log(transcript);
  //       // const response = await uploadBlob(mp3Blob, 'wav');
  //       // console.log(response);
  //       // For testing purposes, log the audio URL
  //       // console.log('Audio URL:', audioUrl);
  //     };

  //     mediaRecorder.stop();
  //     // return response;
  //     return audioBlob;

  //   })
  //   .catch(function (error) {
  //     console.error('Error accessing microphone:', error);
  //   });

  return new Promise((resolve, reject) => {
    playsound("stopped");

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function (stream) {
        mediaRecorder.onstop = async function () {
          duration = Date.now() - startTime;
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          // Resolve the promise with the audioBlob
          resolve(audioBlob);

          // Example usage:
          // const audioUrl = URL.createObjectURL(audioBlob);
          // console.log('Audio URL:', audioUrl);
        };

        mediaRecorder.onerror = function (event) {
          reject(event.error);
        };

        mediaRecorder.stop();
      })
      .catch(function (error) {
        console.error('Error accessing microphone:', error);
        reject(error);
      });
    // if (!mediaRecorder) {
    //   resolve(null);
    //   return;
    // }

    // mediaRecorder.addEventListener('stop', () => {
    //   const mimeType = mediaRecorder.mimeType;
    //   const audioBlob = new Blob(audioChunks, { type: mimeType });

    //   if (capturedStream) {
    //     capturedStream.getTracks().forEach(track => track.stop());
    //   }

    //   resolve(audioBlob);
    // });

    // mediaRecorder.stop();
  });
}

// async function uploadBlob(audioBlob, fileType) {
//   const formData = new FormData();
//   formData.append('audio_data', audioBlob, 'file');
//   formData.append('type', fileType || 'mp3');

//   // Your server endpoint to upload audio:
//   const apiUrl = "http://localhost:3000/upload/audio";

//   const response = await fetch(apiUrl, {
//     method: 'POST',
//     cache: 'no-cache',
//     body: formData
//   });

//   return response.json();
// }

// init();




function audioBufferToWav(aBuffer) {
  let numOfChan = aBuffer.numberOfChannels,
    btwLength = aBuffer.length * numOfChan * 2 + 44,
    btwArrBuff = new ArrayBuffer(btwLength),
    btwView = new DataView(btwArrBuff),
    btwChnls = [],
    btwIndex,
    btwSample,
    btwOffset = 0,
    btwPos = 0;
  setUint32(0x46464952); // "RIFF"
  setUint32(btwLength - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"
  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(aBuffer.sampleRate);
  setUint32(aBuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2); // block-align
  setUint16(16); // 16-bit
  setUint32(0x61746164); // "data" - chunk
  setUint32(btwLength - btwPos - 4); // chunk length

  for (btwIndex = 0; btwIndex < aBuffer.numberOfChannels; btwIndex++)
    btwChnls.push(aBuffer.getChannelData(btwIndex));

  while (btwPos < btwLength) {
    for (btwIndex = 0; btwIndex < numOfChan; btwIndex++) {
      // interleave btwChnls
      btwSample = Math.max(-1, Math.min(1, btwChnls[btwIndex][btwOffset])); // clamp
      btwSample =
        (0.5 + btwSample < 0 ? btwSample * 32768 : btwSample * 32767) | 0; // scale to 16-bit signed int
      btwView.setInt16(btwPos, btwSample, true); // write 16-bit sample
      btwPos += 2;
    }
    btwOffset++; // next source sample
  }

  // let wavHdr = lamejs.WavHeader.readHeader(new DataView(btwArrBuff));

  //Stereo
  // let data = new Int16Array(btwArrBuff, wavHdr.dataOffset, wavHdr.dataLen / 2);
  // let leftData = [];
  // let rightData = [];
  // for (let i = 0; i < data.length; i += 2) {
  //   leftData.push(data[i]);
  //   rightData.push(data[i + 1]);
  // }
  // var left = new Int16Array(leftData);
  // var right = new Int16Array(rightData);

  // if (AudioFormat === "MP3") {
  //   //STEREO
  //   if (wavHdr.channels === 2)
  //     return wavToMp3Stereo(
  //       wavHdr.channels,
  //       wavHdr.sampleRate,
  //       left,
  //       right,
  //     );
  //   //MONO
  //   else if (wavHdr.channels === 1)
  //     return wavToMp3(wavHdr.channels, wavHdr.sampleRate, data);
  // } else 
  return new Blob([btwArrBuff], { type: "audio/wav" });

  function setUint16(data) {
    btwView.setUint16(btwPos, data, true);
    btwPos += 2;
  }

  function setUint32(data) {
    btwView.setUint32(btwPos, data, true);
    btwPos += 4;
  }
}







const commands = {
  'hello': async function () {
    playsound("Hii" + userEmail);
    const url = apiUrl + "checkemail";
    const formData = new FormData();
    // formData.append("user_email", userEmail);
    formData.append('user_email', 'saneesh3152@gmail.com');

    const response = await fetch(url, {
      method: 'POST',
      cache: 'no-cache',
      body: formData
    });
    const result = await response.json();

    if(response.status === 200) {
      if(result['isPresent']) {
        playsound("Hey, looks like you have been already registered. You can now use your mail.");
        playsound("Use menu command to access different actions for your mail");
      } else {
        playsound("Hey, looks like you are here for the first time. Please register yourself with voice biometrics before getting started");
        playsound("Use command register myself to regiter yourself");
      }
    }
    else {
      playsound("Something went wrong at server end, please try again.");
    }
  },
  'menu' : function() {
    playsound("Inorder to compose a new mail, use command compose an email");
    playsound("Inorder to access inbox or search mail, use command inbox.");
  },
  'register myself': function () {
    playsound("Inorder to register yourself with your voice biometrics, please speak something while we record your biometrics.");
    playsound("We do not intend to have any confidential information, so please do not share any confidential information while speaking.");
    playsound("Use command complete registration once you have done speaking.");
    recordAudio();
  },
  'complete registration': function () {
    stopRecording()
      .then(blob => {
        // Use the audio blob here
        playsound('Recording stopped, audio blob is ready');

        fixWebmDuration(blob, duration, { logger: false })
          .then(function (fixedAudioBlob) {

            const audioContext = new AudioContext();
            const reader = new FileReader();
            let waveBlob = null;
            reader.onloadend = () => {
              const arrayBuffer = reader.result;
              audioContext.decodeAudioData(arrayBuffer, async (audioBuffer) => {
                // Do something with audioBuffer
                console.log(audioBuffer);
                waveBlob = audioBufferToWav(audioBuffer);
                const formData = new FormData();
                formData.append('audio_data', waveBlob, 'file');
                formData.append('user_email', userEmail);

                const url = apiUrl + "registervoice";

                const response = await fetch(url, {
                  method: 'POST',
                  cache: 'no-cache',
                  body: formData
                });

                const result = await result.json();

                if (response.status === 200) {
                  if(result['isRegistered']) {
                    playsound("Congratulations, you have been registered successfully. You can now use voice commands to navigate through your gmail.");
                  } else{
                    playsound("Registration failed, please try again by using register myself command.");
                  }
                } else {
                  playsound("Sorry, something went wrong, please try again");
                }
              });
            };
            reader.readAsArrayBuffer(fixedAudioBlob);

          });
      })

  },
  'compose an email': function () {
    playsound('composing mail');
    console.log("entered the 1st function");
    chrome.runtime.sendMessage({ action: "compose" }, function (response) {
      console.log(response);
    });
  },
  'add recipient *tag': function (variable) {
    playsound("entered add recipients");
    chrome.runtime.sendMessage({ action: "add_recipients", data: variable }, function (response) {
      console.log(response);
    });
  },
  'confirm mail address': function () {
    chrome.runtime.sendMessage({ action: "confirm_recipients_mail" }, function (response) {
      console.log(response);
    });
  },
  'add subject *sub': function (variable) {
    chrome.runtime.sendMessage({ action: "add_mail_subject", data: variable }, function (response) {
      console.log(response);
    });
  },
  'confirm mail subject': function () {
    chrome.runtime.sendMessage({ action: "confirm_mail_subject" }, function (response) {
      console.log(response);
    });
  },
  'add body': function () {
    playsound("You have now entered body composition section. You can now start composing the body of the email.");
    playsound("Use done with body command once done");
    recordAudio();
  },
  'done with body': function () {
    playsound("in function");
    stopRecording()
      .then(blob => {
        // Use the audio blob here
        playsound('Recording stopped, audio blob is ready');

        fixWebmDuration(blob, duration, { logger: false })
          .then(function (fixedAudioBlob) {

            const audioContext = new AudioContext();
            const reader = new FileReader();
            let waveBlob = null;
            reader.onloadend = () => {
              const arrayBuffer = reader.result;
              audioContext.decodeAudioData(arrayBuffer, async (audioBuffer) => {
                // Do something with audioBuffer
                console.log(audioBuffer);
                waveBlob = audioBufferToWav(audioBuffer);
                const formData = new FormData();
                formData.append('audio_data', waveBlob, 'file');
                formData.append('user_email', 'saneesh3152@gmail.com');
                // formData.append('user_email', userEmail);

                const url = apiUrl  + "body";

                const response = await fetch(url, {
                  method: 'POST',
                  cache: 'no-cache',
                  body: formData
                });

                const result = await response.json();

                if (response.status === 200) {
                  if (result['isVerified']) {
                    body = result['body'];
                    playsound("Did you mean " + body + " ? To confirm use command send mail, else use command add body to add new body incase you meant something else.");
                  } else {
                    playsound("The user could not be verified. Hence cannot proceed with sending an email.");

                    ///redirect to main menu
                  }
                } else {
                  playsound("Sorry, something went wrong, please try again");
                }
                // FileSaver.saveAs(waveBlob);
              });
              // chrome.runtime.sendMessage({ action: "send_body_blob", blob: waveBlob });
            };

            reader.readAsArrayBuffer(fixedAudioBlob);

          });

      })
      .catch(error => {
        console.log(error);
        console.error('Failed to record audio:', error);
      });
    // chrome.runtime.sendMessage({action : "send_body_audio"});
    // stopRecording()
    //   .then(audioBlob => {
    //     // Use the audio blob here
    //     console.log('Recording stopped, audio blob is ready');

    //     // const reader = new FileReader();
    //     // reader.readAsDataURL(audioBlob);
    //     // reader.onloadend = () => {
    //     //   chrome.runtime.sendMessage({ action: "send_body_blob", blob : reader.result });
    //     // };
    //     const audio = new Audio();
    //     audio.src = URL.createObjectURL(audioBlob);
    //     audio.play();

    //     // For example, create an object URL for the blob
    //     // const audioUrl = URL.createObjectURL(audioBlob);
    //     // console.log('Audio URL:', audioUrl);

    //     // // Optionally, you can play the audio
    //     // const audioElement = new Audio(audioUrl);
    //     // audioElement.play();
    //   })
    //   .catch(error => {
    //     console.log(error);
    //     console.error('Failed to record audio:', error);
    //   }); 
  },
  'send mail': function () {
    chrome.runtime.sendMessage({ action: "send_mail", data: body }, function (response) {
      console.log(response);
    });
  },
  'get email': function () {
    playsound("getting email");
    chrome.runtime.sendMessage({ action: "get_email" }, function (response) {
      email = response.email;
      console.log(email);
      playsound(email);
    });
  },
  'inbox': async function () {
    playsound("in inbox function");
    chrome.runtime.sendMessage({ action: "inbox_options" }, function (response) {
      console.log(response);
    });
  },
  'show unread mails': function () {
    playsound("unread mails");
    chrome.runtime.sendMessage({ action: "show_unread_mails" }, function (response) {
      console.log(response);
    });
  },
  'read mail *ind': function (ind) {
    playsound(ind);
    console.error(ind);
    chrome.runtime.sendMessage({ action: "read_mail_in_unread", index: ind }, function (response) {
      console.log(response);
    });
  },
  'pass on mail *ind': function (ind) {
    playsound(ind);

    chrome.runtime.sendMessage({ action: "forward_in_unread", index: ind }, function (response) {
      console.log(response);
    });
  },
  'pass on to *user': function (recipientsMail) {
    playsound(recipientsMail);
    chrome.runtime.sendMessage({ action: "forward_in_unread_recipients_address", recipients_mail: recipientsMail }, function (response) {
      console.log(response);
    });
  },
  'confirm forwarding': function () {
    playsound("Inorder to verify your request for forwarding this email, please say I provide consent for forwarding the above mail to followed by recipients email address.");
    playsound("Use command verify forwarding in unread once done with providing consent.");
    recordAudio();
  },
  'verify forwarding': function () {
    stopRecording()
      .then(blob => {
        // Use the audio blob here
        playsound('Recording stopped, audio blob is ready');

        fixWebmDuration(blob, duration, { logger: false })
          .then(function (fixedAudioBlob) {

            const audioContext = new AudioContext();
            const reader = new FileReader();
            let waveBlob = null;
            reader.onloadend = () => {
              const arrayBuffer = reader.result;
              audioContext.decodeAudioData(arrayBuffer, async (audioBuffer) => {
                // Do something with audioBuffer
                console.log(audioBuffer);
                waveBlob = audioBufferToWav(audioBuffer);
                const formData = new FormData();
                formData.append('audio_data', waveBlob, 'file');

                const url = apiUrl + "voiceverification";

                const response = await fetch(url, {
                  method: 'POST',
                  cache: 'no-cache',
                  body: formData
                });

                const result = await response.json();
                // FileSaver.saveAs(waveBlob);
                if (response.status === 200) {
                  playsound(result['isVerified']);
                  console.error(result['isVerified']);
                  if (result['isVerified']) {
                    chrome.runtime.sendMessage({ action: "confirm_forward_in_unread" }, function (response) {
                      console.log(response);
                    });
                  } else {
                    playsound("The mail cannot be forwarded since the user cannot be verified. Try again with authorised user.");
                    ///redirect to menu
                  }
                } else {
                  playsound("Sorry, Something went wrong, please try again.");
                }
              });
              // chrome.runtime.sendMessage({ action: "send_body_blob", blob: waveBlob });
            };

            reader.readAsArrayBuffer(fixedAudioBlob);

          });

      })
      .catch(error => {
        console.log(error);
        console.error('Failed to record audio:', error);
      });
  },
  'delete mail *ind': function (ind) {
    chrome.runtime.sendMessage({ action: "delete_in_unread", index: ind }, function (response) {
      console.log(response);
    });
  },
  'confirm deleting': function () {
    playsound("Inorder to verify your request for deleting this email, please say I provide consent for deleting the above mail to followed by recipients email address.");
    playsound("Use command verify deleting in unread once done with providing consent.");
    recordAudio();
  },
  'verify deleting': function () {
    stopRecording()
      .then(blob => {
        // Use the audio blob here
        playsound('Recording stopped, audio blob is ready');

        fixWebmDuration(blob, duration, { logger: false })
          .then(function (fixedAudioBlob) {

            const audioContext = new AudioContext();
            const reader = new FileReader();
            let waveBlob = null;
            reader.onloadend = () => {
              const arrayBuffer = reader.result;
              audioContext.decodeAudioData(arrayBuffer, async (audioBuffer) => {
                // Do something with audioBuffer
                console.log(audioBuffer);
                waveBlob = audioBufferToWav(audioBuffer);
                const formData = new FormData();
                formData.append('audio_data', waveBlob, 'file');

                const url = apiUrl + "voiceverification";

                const response = await fetch(url, {
                  method: 'POST',
                  cache: 'no-cache',
                  body: formData
                });
                // FileSaver.saveAs(waveBlob);
                if (response.status === 200) {
                  if (response.body.isVerified) {
                    chrome.runtime.sendMessage({ action: "confirm_deleting_in_unread" }, function (response) {
                      console.log(response);
                    });
                  } else {
                    playsound("The mail cannot be deleted since the user cannot be verified. Try again with authorised user.");
                    ///redirect to menu
                  }
                } else {
                  playsound("Something went wrong, please try again.");
                }
              });
              // chrome.runtime.sendMessage({ action: "send_body_blob", blob: waveBlob });
            };

            reader.readAsArrayBuffer(fixedAudioBlob);

          });

      })
      .catch(error => {
        console.log(error);
        console.error('Failed to record audio:', error);
      });
  },
  'search *email': function (variable) {
    chrome.runtime.sendMessage({ action: "search_in_unread", data: variable }, function (response) {
      console.log(response);
    });
  },
  'confirm search': function () {
    chrome.runtime.sendMessage({ action: "confirm_search_query_in_unread" }, function (response) {
      console.log(response);
    });
  },
  'read mail *ind in search': function (ind) {
    chrome.runtime.sendMessage({ action: "read_mail_in_search", index: ind }, function (response) {
      console.log(response);
    });
  },
  'pass on mail *ind in search': function (ind) {
    chrome.runtime.sendMessage({ action: "forward_in_search", index: ind }, function (response) {
      console.log(response);
    });
  },
  'pass on to *user in search': function (recipientsMail) {
    playsound(recipientsMail);
    chrome.runtime.sendMessage({ action: "forward_in_search_recipients_address", recipients_mail: recipientsMail }, function (response) {
      console.log(response);
    });
  },
  'confirm forwarding in search': function () {
    playsound("Inorder to verify your request for forwarding this email, please say I provide consent for forwarding the above mail to followed by recipients email address.");
    playsound("Use command verify forwarding in search once done with providing consent.");
    recordAudio();
  },
  'verify forwarding in search': function () {
    stopRecording()
      .then(blob => {
        // Use the audio blob here
        playsound('Recording stopped, audio blob is ready');

        fixWebmDuration(blob, duration, { logger: false })
          .then(function (fixedAudioBlob) {

            const audioContext = new AudioContext();
            const reader = new FileReader();
            let waveBlob = null;
            reader.onloadend = () => {
              const arrayBuffer = reader.result;
              audioContext.decodeAudioData(arrayBuffer, async (audioBuffer) => {
                // Do something with audioBuffer
                console.log(audioBuffer);
                waveBlob = audioBufferToWav(audioBuffer);
                const formData = new FormData();
                formData.append('audio_data', waveBlob, 'file');

                const url = apiUrl + "voiceverification";

                const response = await fetch(url, {
                  method: 'POST',
                  cache: 'no-cache',
                  body: formData
                });
                // FileSaver.saveAs(waveBlob);
                if (response.status === 200) {
                  if (response.body.isVerified) {
                    chrome.runtime.sendMessage({ action: "confirm_forwarding_in_search" }, function (response) {
                      console.log(response);
                    });
                  } else {
                    playsound("The mail cannot be forwarded since the user cannot be verified. Try again with authorised user.");
                    ///redirect to menu
                  }
                }
              });
            };

            reader.readAsArrayBuffer(fixedAudioBlob);

          });

      })
      .catch(error => {
        console.log(error);
        console.error('Failed to record audio:', error);
      });
  },
  'delete mail *ind in search': function (ind) {
    chrome.runtime.sendMessage({ action: "delete_in_search", index: ind }, function (response) {
      console.log(response);
    });
  },
  'confirm deleting in search': function () {
    playsound("Inorder to verify your request for forwarding this email, please say I provide consent for forwarding the above mail to followed by recipients email address.");
    playsound("Use command verify forwarding in search once done with providing consent.");
    recordAudio();
  },
  'verify deleting in search': function () {
    stopRecording()
      .then(blob => {
        // Use the audio blob here
        playsound('Recording stopped, audio blob is ready');

        fixWebmDuration(blob, duration, { logger: false })
          .then(function (fixedAudioBlob) {

            const audioContext = new AudioContext();
            const reader = new FileReader();
            let waveBlob = null;
            reader.onloadend = () => {
              const arrayBuffer = reader.result;
              audioContext.decodeAudioData(arrayBuffer, async (audioBuffer) => {
                // Do something with audioBuffer
                console.log(audioBuffer);
                waveBlob = audioBufferToWav(audioBuffer);
                const formData = new FormData();
                formData.append('audio_data', waveBlob, 'file');

                const url = apiUrl + "voiceverification";

                const response = await fetch(url, {
                  method: 'POST',
                  cache: 'no-cache',
                  body: formData
                });
                // FileSaver.saveAs(waveBlob);
                if (response.status === 200) {
                  if (response.body.isVerified) {
                    chrome.runtime.sendMessage({ action: "confirm_deleting_in_search" }, function (response) {
                      console.log(response);
                    });
                  } else {
                    playsound("The mail cannot be deleted since the user cannot be verified. Try again with authorised user.");
                    ///redirect to menu
                  }
                }
              });
            };

            reader.readAsArrayBuffer(fixedAudioBlob);

          });

      })
      .catch(error => {
        console.log(error);
        console.error('Failed to record audio:', error);
      });
  },
};

function playsound(res) {
  var text = res;
  var msg = new SpeechSynthesisUtterance(text);
  var voices = window.speechSynthesis.getVoices();
  console.log(voices)
  msg.voice = voices[0];
  window.speechSynthesis.speak(msg);
}

function startAnnyang() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (stream) {
      // Permission granted
      console.log('Audio permission granted');

      // Add our commands to annyang
      if (annyang) {
        annyang.addCommands(commands);

        // Start listening.
        annyang.start({ autoRestart: true, continuous: false }); // Adjust options as needed
        console.log('Annyang loaded and started');
        // playsound("annyang started successfully");
        playsound("Hey, glad to have you here. If you are here for the first time use command hello to get started, else use command menu to access menu.");

      } else {
        playsound("something went wrong");
        console.log("something went wrong");
      }
    })
    .catch(function (error) {
      // Permission denied or other error
      console.error('Audio permission denied or error occurred', error);
    });
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "start") {
    console.log('request recieved');
    // container = request.microphone
    startAnnyang();
  } else if (request.action === "record_audio") {
    recordAudio();
  } else if (request.action === "get_audio") {
    stopRecording();
  }
  return true;
});