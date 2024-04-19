'use strict';

// let recieversMail, subject, body;
// let bodyAudioBlob;
// let audBlob;
// let recog;
// let interim_transcript;
// let mediaRec;
// let audChunks;
// recieversMail = [];

// const initialise = () => {
//     recog = new webkitSpeechRecognition();
//     recog.continuous = false;
//     recog.interimResults = true;
//     recog.lang = languageSelected || "en-US";

//     recog.onresult = event => {
//       let last = event.results.length - 1;
//       let lastTranscript = event.results[last][0].transcript;
//       interim_transcript = '';
//       let final_transcript = '';

//       for (var i = event.resultIndex; i < event.results.length; ++i) {
//           // Verify if the recognized text is the last with the isFinal property
//         if (event.results[i].isFinal) {
//           final_transcript += event.results[i][0].transcript;
//         } else {
//           interim_transcript += event.results[i][0].transcript;
//         }
//       }
//     }

//     recog.onerror = event => {
//       console.log("error", event.error)
//       if(event.error === 'not-allowed'){
//         const errorMessage = "AudioCapture permission has been blocked because of a Feature Policy applied to the current document. See https://goo.gl/EuHzyv for more details.";
//         chrome.runtime.sendMessage({error: errorMessage})
//         recog.stop();
//       }
//     }

//     recog.onspeechstart = event => console.log("speech started");
//     recog.onspeechend = event => recog.stop();
//     recog.onend = function(event) {
//       if (isStopButtonClicked) {
//         recog.stop();
//       } else {
//         recog.start();
//       }
//     }

//     recog.start();
// }

// // const startTracking = () => recognition.start();

// const dispose = () => recog = null;

// function composeEmail() {
//     chrome.tts.speak("You have now reached the compose page, you can now compose or send a mail.");
//     getRecieversMail();
//     getMailSubject();
//     getMailBody();
//     sendMail();
// }

// function getRecieversMail() {
//     initialise();
//     chrome.tts.speak("Enter reciever's email address");
//     if(interim_transcript != ''){
//         if(confirmation(interim_transcript)){
//             recieversMail.push(interim_transcript);
//             chrome.tts.speak("Do you want to add more recipients? Say yes to add or say no otherwise");
//             if(interim_transcript === 'yes'){
//                 getRecieversMail();
//             } else if(interim_transcript === 'no'){
//                 return;
//             }
//         } else {
//             getRecieversMail();
//         }
//     } else{
//         getRecieversMail();
//     }
//     dispose()
// }

// function getMailSubject() {
//     initialise();
//     chrome.tts.speak("Enter subject of your mail");
//     if(interim_transcript != ""){
//         let mailSubject = interim_transcript;
//         if(confirmation(mailSubject)){
//             subject = mailSubject;
//             return;
//         } else{
//             getMailSubject();
//         }
//     } else{
//         getMailSubject();
//     }
//     dispose();
// }

// function getMailBody() {
//     initialise();
//     chrome.tts.speak("Enter body of the mail");
//     chrome.tts.speak("Say done once done with mail body.");
//     let msg = '';
//     recordBodyAudio();
//     while(interim_transcript != 'done'){
//       msg += interim_transcript;
//     }
//     stopBodyAudioRecording();
//     if(confirmation(msg)){
//       body = msg;
//       bodyAudioBlob = audBlob;
//     } else {
//       getMailBody();
//     }
//     dispose();
// }

// function sendMail() {
//   initialise();
//   chrome.tts.speak("Do you wish to send this mail ? Say yes to send the mail or say no otherwise.");
//   if(interim_transcript === "yes") {
//     // uploadData(bodyAudioBlob, recieversMail, subject, body);
//     chrome.tts.speak("The mail has been successfully sent");
//     chrome.tts.speak("Redirecting you to main menu now");

//   } else if (interim_transcript === "no") {
//     return;
//   } else {
//     sendMail();
//   }
// }

// function confirmation(userResponse) {
//     chrome.tts.speak("Did you mean");
//     chrome.tts.speak(userResponse);
//     chrome.tts.speak("Say yes to comfirm else say no in case you meant something else");
//     if(interim_transcript !=  ''){
//         let res = interim_transcript;
//         if(res === 'yes'){
//             return true;
//         } else{
//             return false;
//         }
//     }
//     return false;
// }

// const recordBodyAudio = () => {
//     navigator.mediaDevices.getUserMedia({ audio: true })
//         .then(function (stream) {
//           mediaRec = new MediaRecorder(stream)
//           audChunks = [];
//           mediaRec.ondataavailable = function (event) {
//             if (event.data.size > 0) {
//               audChunks.push(event.data);
//             }
//           };

//           // mediaRecorder.onstop = function () {
//           //   const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//           //   const audioUrl = URL.createObjectURL(audioBlob);
//           //   // For testing purposes, log the audio URL
//           //   console.log('Audio URL:', audioUrl);
//           // };

//           mediaRec.start();
//         })
//         .catch(function (error) {
//           console.error('Error accessing microphone:', error);
//         });
// }

// const stopBodyAudioRecording = () => {
//     navigator.mediaDevices.getUserMedia({ audio: true })
//         .then(function (stream) {


//           mediaRec.onstop = async function () {
//             audBlob = new Blob(audChunks, { type: 'audio/wav' });
//             const audioUrl = URL.createObjectURL(audBlob);

//             // audioElement = new Audio(audioUrl);
//             // audioElement.play();

//             // audioElement.addEventListener('canplaythrough', function() {
//             //   startTracking();
//             // });

//             // recognition.start(audioBlob);
//             // console.log(transcript);
//             // const response = await uploadBlob(mp3Blob, 'wav');
//             // console.log(response);
//             // For testing purposes, log the audio URL
//             console.log('Audio URL:', audioUrl);
//           };

//           mediaRec.stop();
//           // return response;

//         })
//         .catch(function (error) {
//           console.error('Error accessing microphone:', error);
//         });
// }

// async function uploadData(audBlob, recipients, subject, mailBody) {
//     const formData = new FormData();
//     formData.append('audio_data', audBlob, 'file');
//     formData.append('audio_type', 'wav');
//     formData.append('recipients_mail', recipients);
//     formData.append('mail_subject', subject);
//     formData.append('mail_body', mailBody);

//     // Your server endpoint to upload audio:
//     const apiUrl = "http://localhost:3000/upload/audio";

//     const response = await fetch(apiUrl, {
//       method: 'POST',
//       cache: 'no-cache',
//       body: formData
//     });

//     return response.json();
// }

// chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
//   if(request.data === "compose"){
//     composeEmail();
//   }
//   return true;
// });



// const initialise = () => {
//     recog = new webkitSpeechRecognition();
//     recog.continuous = false;
//     recog.interimResults = true;
//     recog.lang = languageSelected || "en-US";

//     recog.onresult = event => {
//       let last = event.results.length - 1;
//       let lastTranscript = event.results[last][0].transcript;
//       interim_transcript = '';
//       let final_transcript = '';

//       for (var i = event.resultIndex; i < event.results.length; ++i) {
//           // Verify if the recognized text is the last with the isFinal property
//         if (event.results[i].isFinal) {
//           final_transcript += event.results[i][0].transcript;
//         } else {
//           interim_transcript += event.results[i][0].transcript;
//         }
//       }
//     }

//     recog.onerror = event => {
//       console.log("error", event.error)
//       if(event.error === 'not-allowed'){
//         const errorMessage = "AudioCapture permission has been blocked because of a Feature Policy applied to the current document. See https://goo.gl/EuHzyv for more details.";
//         chrome.runtime.sendMessage({error: errorMessage})
//         recog.stop();
//       }
//     }

//     recog.onspeechstart = event => console.log("speech started");
//     recog.onspeechend = event => recog.stop();
//     recog.onend = function(event) {
//       if (isStopButtonClicked) {
//         recog.stop();
//       } else {
//         recog.start();
//       }
//     }

//     recog.start();
// }

// // const startTracking = () => recognition.start();

// const dispose = () => recog = null;
let recipientsMail = [], subject, body;
let bodyAudioBlob = null;
let audioBlob;
let audioUrl = '';
let mediaRecording;
let audChunks;

let dummyMailAddress = '';
let dummySubject = '';
let dummyBody = '';

let apiUrl = "https://c509-2401-4900-56fb-5162-805d-5c70-a7a5-bed4.ngrok-free.app/"

function composeEmail() {
  console.log("entered compose mail")
  playsound("You have now reached the compose page, you can now compose or send a mail.");
  playsound("Inorder to add recipients use command add recipient recipients email address");
}

function getRecipientsMail(variable) {
  dummyMailAddress = variable;
  playsound("Did you mean " + dummyMailAddress + " ? To confirm use command confirm mail address else use add recipient command to add another mail");
}

function confirmRecipientsMail() {
  if (dummyMailAddress !== '') {
    recipientsMail.push(dummyMailAddress);
    playsound("Recipient added successfully");
    playsound("To add more recipients use command add recipient recipient's email address");
    playsound("To add subject of the mail, use command add subject followed by subject of your mail");
    playsound("To add body of the mail, use command add body");
  } else {
    playsound("Recipient mail cannot be empty. Use add recipient recipients email address command to add recipients email address");
  }
}

function getMailSubject(variable) {
  dummySubject = variable;
  playsound("Did you mean " + dummySubject + " ? To confirm use command confirm mail subject else use add subject command to change mail subject");
}

function confirmMailSubject() {
  if (dummySubject !== '') {
    subject = dummySubject;
    playsound("Mail Subject added successfully");
    playsound("To add body of the mail, use command add body");
  }
}

function getMailBody() {
  playsound("You have now entered body composition section. You can now start composing the body of the email.");
  playsound("Use done command once done");
  chrome.runtime.sendMessage({ action: "get_mail_body_audio" }, function (response) {
    console.log(response);
  });
}

function doneWithMailBody(audioBlob) {
  playsound("compose script");
  const audioUrl = URL.createObjectURL(audioBlob);
  console.log('Audio URL:', audioUrl);

  // Optionally, you can play the audio
  const audioElement = new Audio(audioUrl);
  audioElement.play();
  // if (audioUrl != '') {
  //   const audioElement = new Audio(audioUrl);
  //   playsound("Did you mean ");
  //   audioElement.play();
  //   playsound("To confirm mail body use command confirm body. If you meant something else use command add body to change mail body");
  // }
}

async function verifyBodyAudio(blob) {
  playsound("Please wait a moment while we verify the user...");
  // const reader = new FileReader();
  // reader.readAsDataURL();
  // reader.onloadend = () => {
  //   chrome.runtime.sendMessage({ action: "send_body_blob", blob: reader.result });
  // };
  const formData = new FormData();
  formData.append('audio_data', blob, 'file');

  const apiUrl = "https://e4e4-183-87-229-110.ngrok-free.app/voiceverification";

  const response = await fetch(apiUrl, {
    method: 'POST',
    cache: 'no-cache',
    body: formData
  });
  

  if(response.status === 200){
    if (response.body.isVerified) {
      dummyBody = response.body.body;
      playsound("Did you mean " + dummyBody + " ? To confirm use command send mail, else use command add body to add new body incase you meant something else.");
    } else {
      playsound("The user could not be verified. Hence cannot proceed with sending an email.");
  
      ///redirect to main menu
    }  
  } else {
    playsound("Sorry, something went wrong at the server end");
  }
}

async function sendMail(body) {
  playsound("Sending your email");
  const formData = new FormData();

  formData.append("user_email", "saneesh@gmail.com");
  // formData.append("user_email", userEmail);
  formData.append('og_sender', "mihir");

  if (recipientsMail.length === 0) {
    playsound("No recipients found. Please add recipients to send mail");
    return;
  } else {
    // recipientsMail.forEach(recipientMail => {
    //   formData.append('recipients_address[]', recipientMail);
    // });
    formData.append('recipients_address', JSON.stringify(recipientsMail));
  }

  formData.append("subject", subject === "" ? "No Subject" : subject);

  if (body !== '') {
    formData.append("body", body);
  } else {
    playsound("Mail body seems to be empty. Cannot send empty mail. Use command add body to add body of your mail inorder to send an email");
    return;
  }


  // Your server endpoint to upload audio:
  const url = apiUrl + "sendemail";

  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    body: formData
  });

  const result = await response.json();


  if(response.status === 200){
    if(result['sent']){
      playsound("Email sent successfully");
    } else {
      playsound("Something went wrong in sending email, please try again using command compose an email");
    }
    
  } else {
    playsound("Something went wrong in sending email, please try again using command compose an email");
  }

  recipientsMail = [];
  body = "";
  subject = "";
}

function playsound(res) {
  var text = res;
  var msg = new SpeechSynthesisUtterance(text);
  var voices = window.speechSynthesis.getVoices();
  console.log(voices)
  msg.voice = voices[0];
  window.speechSynthesis.speak(msg);
}

// async function uploadData(audBlob) {
//   const formData = new FormData();
//   formData.append('audio_data', audBlob, 'wav');
//   // formData.append('audio_type', 'wav');
//   // formData.append('recipients_mail', recipients);
//   // formData.append('mail_subject', subject);
//   // formData.append('mail_body', mailBody);

//   // Your server endpoint to upload audio:
//   const apiUrl = "https://ff68-2409-4040-d10-b299-85ef-10e1-f90c-6676.ngrok-free.app/testaudio";

//   const response = await fetch(apiUrl, {
//     method: 'POST',
//     cache: 'no-cache',
//     body: formData
//   });

//   return response.json();
// }



chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "compose") {
    composeEmail();
  } else if (request.action === "add_recipients") {
    getRecipientsMail(request.data);
  } else if (request.action === "confirm_recipients_mail") {
    confirmRecipientsMail();
  } else if (request.action === "add_mail_subject") {
    getMailSubject(request.data);
  } else if (request.action === "confirm_mail_subject") {
    confirmMailSubject();
  } else if (request.action === "add_mail_body") {
    getMailBody();
  } else if (request.action === "receive_body_blob") {
    fetch(request.blob)
      .then(res => res.blob())
      .then(blob => {
        // console.log('Blob:', blob);
        // // Now you can use the blob, e.g., create an object URL to play it
        // const audioUrl = URL.createObjectURL(blob);
        // const audioElement = new Audio(audioUrl);
        // audioElement.play();

        verifyBodyAudio(blob);
      });
  } else if (request.action === "confirm_mail_body") {
    confirmMailBody();
  } else if (request.action === "send_mail") {
    sendMail(request.data);
  }
});