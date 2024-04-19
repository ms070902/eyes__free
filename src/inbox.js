'use strict';

let apiUrl = "https://c509-2401-4900-56fb-5162-805d-5c70-a7a5-bed4.ngrok-free.app/"
// let unreadMailsArray = [

//     {
//         "subject": "hey",
//         "from": "Aneesh <saneesh3152@gmail.com>",
//         "body": "hey\r\n"
//     },
//     {
//         "subject": "hello",
//         "from": "Aneesh <saneesh3152@gmail.com>",
//         "body": "hello\r\n"
//     },
//     {
//         "subject": "hey",
//         "from": "Aneesh <saneesh3152@gmail.com>",
//         "body": "hey\r\n"
//     },
//     {
//         "subject": "hello",
//         "from": "Aneesh <saneesh3152@gmail.com>",
//         "body": "hello\r\n"
//     },
//     {
//         "subject": "hey",
//         "from": "Aneesh <saneesh3152@gmail.com>",
//         "body": "hey\r\n"
//     }

// ];
let unreadMailsArray = [];
let searchedMailsArray = [];
let mailToBeForwarded;
let mailToBeDeleted;
let recipientsAddressForMailToBeForwardedInUnread = '';
let mailToBeForwardedIndexInUnread;
let mailToBeDeletedIndexInUnread;
let mailToBeForwardedInSearch;
let mailToBeDeletedInSearch;
let recipientsAddressForMailToBeForwardedInSearch = '';
let mailToBeForwardedIndexInSearch;
let mailToBeDeletedIndexInSearch;
let dummySearchQuery = "";
let searchQuery = "";
let userEmail = "";

chrome.runtime.sendMessage({ action: "get_email" }, function (response) {
    userEmail = response.email;
});


function inboxOptions() {
    playsound("You have now reached inbox section, you can now read mails in your inbox");
    playsound("Inorder to read emails from unread section use command show unread mails.");
    playsound("Inorder to search an email from inbox, use command search followed by user email.");
}

async function getUnreadMails() {
    const url = apiUrl + "reademail";

    var formdata = new FormData();
    formdata.append("user_email", "saneesh3152@gmail.com");
    // formdata.append("user_email", userEmail);

    var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };

    fetch(url, requestOptions)
        .then(response => response.json())
        .then(function (result) {
            unreadMailsArray = result;
            readAllMailsInBriefInUnread();
        })
        .catch(error => console.error('error', error));

    // fetch(url)
    //     .then((response) => response.json())
    //     .then((res) => {
    //         const data = res;
    //         console.error(data);
    //         playsound(data);
    //         // unreadMailsArray = data;
    //         // readAllMailsInBriefInUnread();
    //     })
    //     .catch((error) => {
    //         console.error(error);
    //         playsound("Something went wrong while getting unread mails" + error);
    //     });

    // let headersList = {
    //     "Accept": "*/*",
    //     "Content-Type": "application/json"
    //     // "User-Agent": "Thunder Client (https://www.thunderclient.com)"
    // }

    // const formData = new FormData();
    // formData.append('user', 'saneesh3152@gmail.com');

    // let response = await fetch("https://9293-202-179-95-90.ngrok-free.app/reademail", {
    //     method: "POST",
    //     body: formData,
    //     headers: headersList,
    // });

    // let data = await response.json();
    // console.error(typeof (data));
    // console.error(data);

}

function readAllMailsInBriefInUnread() {
    let len = unreadMailsArray.length;
    playsound("You have " + len + " unread emails");

    for (let index = 0; index < len; index++) {
        const username = unreadMailsArray[index].from;
        const subject = unreadMailsArray[index].subject;
        playsound("Mail number " + (index + 1) + "is from " + username + " with subject " + subject);
    }

    playsound("Inorder to read a particular mail in detail, use command read mail followed by mail number.");
    playsound("Inorder to search mail from particular user, use command search followed by user email.");
}

function readMailInDetailInUnread(ind) {
    let index = parseInt(ind) - 1;
    console.error(index);
    let len = unreadMailsArray.length;
    if (index >= 0 && index < len) {
        ///read mail
        const mail = unreadMailsArray[index];
        playsound("This mail is from " + mail.from);
        playsound("The subject of the mail is " + mail.subject);
        playsound("The body of the mail says " + mail.body);
        playsound("Do you want to forward this email? Inorder to do so use command pass on mail " + (index + 1));
        playsound("Do you want to delete this email? Inorder to do so use command delete mail " + (index + 1));
    } else {
        playsound("It seems that you are trying to access incorrect mail. Please use command show unread mails inorder to get unread emails");
    }
}

function forwardMailInUnread(ind) {
    let index = parseInt(ind) - 1;
    // console.error(index);
    // console.error(recipientsEmailAddress);
    let len = unreadMailsArray.length;
    if (index >= 0 && index < len) {
        mailToBeForwarded = unreadMailsArray[index];
        // recipientsAddressForMailToBeForwardedInUnread = recipientsEmailAddress;
        mailToBeForwardedIndexInUnread = index + 1;
        playsound("In order to add recipients address use command pass on to followed by recipients email address");
        // playsound("Are you sure you want to forward mail from " + mailToBeForwarded.from + " with subject " + mailToBeForwarded.subject + " to " + recipientsEmailAddress + "?");
        // playsound("Inorder to confirm forwarding this email use command confirm forwarding in unread.");
    } else {
        playsound("It seems that you are trying to access incorrect mail. Please use command show unread emails inorder to get unread emails");
    }
}

function forwardMailInUnreadWithAddress(recipientsEmailAddress) {
    recipientsAddressForMailToBeForwardedInUnread = recipientsEmailAddress;
    playsound("Are you sure you want to forward mail from " + mailToBeForwarded.from + " with subject " + mailToBeForwarded.subject + " to " + recipientsEmailAddress + "?");
    playsound("Inorder to confirm forwarding this email use command confirm forwarding.");

}

async function confirmForwardingMailInUnread() {
    playsound("Please wait a moment while we forward your mail to " + recipientsAddressForMailToBeForwardedInUnread);
    let recipientsAddress = [];
    recipientsAddress.push(recipientsAddressForMailToBeForwardedInUnread);
    const formData = new FormData();
    // formData.append("user_email", userEmail);
    formData.append("user_email", "saneesh3152@gmail.com");
    formData.append("og_sender", mailToBeForwarded.from);
    formData.append("recipients_address", JSON.stringify(recipientsAddress));
    formData.append("subject", mailToBeForwarded.subject);
    formData.append("body", mailToBeForwarded.body);

    const url = apiUrl + "sendemail";
    const response = await fetch(url, {
        method: 'POST',
        cache: 'no-cache',
        body: formData
    });

    const result = await response.json();

    if (response.status === 200) {
        if(result['sent']){
            playsound("Mail successfully forwarded to " + recipientsAddressForMailToBeForwardedInUnread);
        } else{
            playsound("Something went wrong, please try forwarding mail again using command forward mail " + mailToBeForwardedIndexInUnread + " from unread to followed by recipients address");
        }
        
    } else {
        playsound("Something went wrong, please try forwarding mail again using command forward mail " + mailToBeForwardedIndexInUnread + " from unread to followed by recipients address");
    }
    mailToBeForwarded = null;
    recipientsAddressForMailToBeForwardedInUnread = '';
}

function deleteMailInUnread(ind) {
    let index = parseInt(ind) - 1;
    let len = unreadMailsArray.length;
    if (index >= 0 && index < len) {
        ///read mail
        mailToBeDeleted = unreadMailsArray[index];
        mailToBeDeletedIndexInUnread = index + 1;
        playsound("Are you sure you want to delete mail from " + mailToBeDeleted.from + " with subject " + mailToBeDeleted.subject + "?");
        playsound("Inorder to confirm deleting this email use command confirm deleting.");
    } else {
        playsound("It seems that you are trying to access incorrect mail. Please use command show unread emails inorder to get unread emails");
    }
}

async function confirmDeletingMailInUnread() {
    playsound("Please wait a moment while we delete your mail.");
    const formData = new FormData();
    formData.append("user_email", userEmail);
    formData.append("og_sender", mailToBeDeleted.from);
    formData.append("subject", mailToBeDeleted.subject);
    formData.append("body", mailToBeDeleted.body);

    const url = apiUrl + "deleteemail";
    const response = await fetch(url, {
        method: 'POST',
        cache: 'no-cache',
        body: formData
    });

    if (response.status === 200) {
        playsound("Mail successfully sent to trash.");
    } else {
        playsound("Something went wrong, please try deleting mail again using command delete mail " + mailToBeDeletedIndexInUnread + " from unread.");
    }
    mailToBeDeleted = null;
}

function searchMailsQuery(search) {
    dummySearchQuery = search;
    playsound("Do you want to search mails from " + dummySearchQuery + " ? Use command confirm search to confirm your search query, else use command search in unread followed by user email incase you meant something different.");
}

function confirmSearchQueryInUnread() {
    if (dummySearchQuery !== "") {
        searchQuery = dummySearchQuery;
        getSearchedMailResults(searchQuery);
    }
}

async function getSearchedMailResults(search) {
    playsound("Please wait a moment while we get results for your search query.");
    const url = apiUrl + "readspecificemail";

    var formdata = new FormData();
    formdata.append("user_email", "saneesh3152@gmail.com");
    // formdata.append("user_email", userEmail);
    formdata.append("sender_email", search);

    var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };

    fetch(url, requestOptions)
        .then(response => response.json())
        .then(function (result) {
            searchedMailsArray = result;
            readSearchedMailsResultsInBriefInUnread();
        })
        .catch(error => console.error('error', error));
}

function readSearchedMailsResultsInBriefInUnread() {
    let len = searchedMailsArray.length;
    playsound("Found " + len + " results for yor search query.");
    for (let index = 0; index < len; index++) {
        const username = searchedMailsArray[index].from;
        const subject = searchedMailsArray[index].subject;
        playsound("Mail number " + (index + 1) + "is from " + username + " with subject " + subject);
    }

    playsound("Inorder to read a particular mail in detail, use command read mail followed by mail number in search");
}

function readSearchedMailInDetailInUnread(ind) {
    let index = parseInt(ind) - 1;
    let len = searchedMailsArray.length;
    if (index >= 0 && index < len) {
        ///read mail
        const mail = searchedMailsArray[index];
        playsound("This mail is from " + mail.from);
        playsound("The subject of the mail is " + mail.subject);
        playsound("The body of the mail says " + mail.body);
        playsound("Do you want to forward this email? Inorder to do so use command pass on mail " + (index + 1) + " in search.");
        playsound("Do you want to delete this email? Inorder to do so use command delete mail " + (index + 1) + " in search.");
    } else {
        playsound("It seems that you are trying to access incorrect mail. Please use command search in unread followed by user email");
    }
}

function forwardMailInSearchInUnread(ind) {
    let index = parseInt(ind) - 1;
    // console.error(index);
    // console.error(recipientsEmailAddress);
    let len = searchedMailsArray.length;
    if (index >= 0 && index < len) {
        mailToBeForwardedInSearch = searchedMailsArray[index];
        // recipientsAddressForMailToBeForwardedInUnread = recipientsEmailAddress;
        mailToBeForwardedIndexInSearch = index + 1;
        playsound("In order to add recipients address use command pass on to followed by recipients email address in search");
        // playsound("Are you sure you want to forward mail from " + mailToBeForwarded.from + " with subject " + mailToBeForwarded.subject + " to " + recipientsEmailAddress + "?");
        // playsound("Inorder to confirm forwarding this email use command confirm forwarding in unread.");
    } else {
        playsound("It seems that you are trying to access incorrect mail. Please use command show unread emails inorder to get unread emails");
    }
}

function forwardMailInUnreadWithAddressInSearch(recipientsEmailAddress) {
    recipientsAddressForMailToBeForwardedInSearch = recipientsEmailAddress;
    playsound("Are you sure you want to forward mail from " + mailToBeForwardedInSearch.from + " with subject " + mailToBeForwardedInSearch.subject + " to " + recipientsEmailAddress + "?");
    playsound("Inorder to confirm forwarding this email use command confirm forwarding in search.");
}

async function confirmForwardingMailInSearchInUnread() {
    playsound("Please wait a moment while we forward your mail to " + recipientsAddressForMailToBeForwardedInSearch);
    const formData = new FormData();
    formData.append("user_email", userEmail);
    formData.append("og_sender", mailToBeForwardedInSearch.from);
    formData.append("to", recipientsAddressForMailToBeForwardedInSearch);
    formData.append("subject", mailToBeForwardedInSearch.subject);
    formData.append("body", mailToBeForwardedInSearch.body);

    const url = apiUrl + "sendemail";
    const response = await fetch(url, {
        method: 'POST',
        cache: 'no-cache',
        body: formData
    });

    const result = await response.json();

    if (response.status === 200) {
        if(result['sent']){
            playsound("Mail successfully forwarded to " + recipientsAddressForMailToBeForwardedInSearch);
        } else{
            playsound("Something went wrong, please try forwarding mail again using command forward mail " + mailToBeForwardedIndexInSearch + " from unread to followed by recipients address");
        }
        
    } else {
        playsound("Something went wrong, please try forwarding mail again using command forward mail " + mailToBeForwardedIndexInSearch + " from unread to followed by recipients address");
    }
    mailToBeForwardedInSearch = null;
    recipientsAddressForMailToBeForwardedInSearch = '';
}

function deleteMailInSearchInUnread(ind) {
    let index = parseInt(ind) - 1;
    let len = searchedMailsArray.length;
    if (index >= 0 && index < len) {
        ///read mail
        mailToBeDeletedInSearch = searchedMailsArray[index];
        mailToBeDeletedIndexInSearch = index + 1;
        playsound("Are you sure you want to delete mail from " + mailToBeDeletedInSearch.from + " with subject " + mailToBeDeletedInSearch.subject + "?");
        playsound("Inorder to confirm deleting this email use command confirm deleting in unread.");
    } else {
        playsound("It seems that you are trying to access incorrect mail. Please use command show unread emails inorder to get unread emails");
    }
}

async function confirmDeletingMailInSearchInUnread() {
    playsound("Please wait a moment while we delete your mail.");
    const formData = new FormData();
    formData.append("user_email", userEmail);
    formData.append("og_sender", mailToBeDeletedInSearch.from);
    formData.append("subject", mailToBeDeletedInSearch.subject);
    formData.append("body", mailToBeDeletedInSearch.body);

    const url = apiUrl + "deleteemail";
    const response = await fetch(url, {
        method: 'POST',
        cache: 'no-cache',
        body: formData
    });

    if (response.status === 200) {
        playsound("Mail successfully sent to trash.");
    } else {
        playsound("Something went wrong, please try deleting mail again using command delete mail " + mailToBeDeletedIndexInSearch + " from unread.");
    }
    mailToBeDeletedInSearch = null;
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
    if (request.action === "inbox_options") {
        inboxOptions();
    } else if (request.action === 'show_unread_mails') {
        playsound('showing mails');
        getUnreadMails();
    } else if (request.action === 'read_mail_in_unread') {
        playsound("reading mail no " + request.index);
        readMailInDetailInUnread(request.index);
    } else if (request.action === "forward_in_unread") {
        forwardMailInUnread(request.index);
    } else if (request.action === "forward_in_unread_recipients_address") {
        forwardMailInUnreadWithAddress(request.recipients_mail);
    } else if (request.action === 'confirm_forward_in_unread') {
        confirmForwardingMailInUnread();
    } else if (request.action === 'delete_in_unread') {
        deleteMailInUnread(request.index);
    } else if (request.action === 'confirm_deleting_in_unread') {
        confirmDeletingMailInUnread();
    } else if (request.action === 'search_in_unread') {
        getSearchedMailResults(request.data);
    } else if (request.action === 'confirm_search_query_in_unread') {
        confirmSearchQueryInUnread();
    } else if (request.action === 'read_mail_in_search') {
        readSearchedMailInDetailInUnread(request.index);
    } else if (request.action === 'forward_in_search') {
        forwardMailInSearchInUnread(request.index);
    } else if (request.action === 'forward_in_search_recipients_address') {
        forwardMailInSearchInUnread(request.recipients_mail);
    } else if (request.action === 'confirm_forwarding_in_search') {
        confirmForwardingMailInSearchInUnread();
    } else if (request.action === 'delete_in_search') {
        deleteMailInSearchInUnread(request.index);
    } else if (request.action === 'confirm_deleting_in_search') {
        confirmDeletingMailInSearchInUnread();
    }
});