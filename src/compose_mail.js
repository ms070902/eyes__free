'use strict';
let recipientsMail = [], subject, body;
let bodyAudioBlob = null;
let audioBlob;
let audioUrl = '';
let mediaRecording;
let audChunks;

let dummyMailAddress = '';
let dummySubject = '';
let dummyBody = '';

let userEmail = "";

chrome.runtime.sendMessage({ action: "get_email" }, function (response) {
  userEmail = response.email;
});

let apiUrl = "https://9506-202-179-88-166.ngrok-free.app/"

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


  if (response.status === 200) {
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

  // formData.append("user_email", "saneesh@gmail.com");
  formData.append("user_email", userEmail);
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


  if (response.status === 200) {
    if (result['sent']) {
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