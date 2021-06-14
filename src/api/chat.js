import Config from 'react-native-config';
import apiRequest from './apiRequest';

export async function getConversations({ token, userId, requestedPage }) {
  console.log('getConversations');

  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({ "userId": userId, "requestedPage": requestedPage, "requestedRecordsNumber": 10 });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  return apiRequest(
    `${Config.NAMIQUI_GATEWAY}/api/users/chat/messaging/conversations/get`,
    requestOptions,
    'getConversations',
  );
}

export async function getMessages({ token, userId, partnerId, requestedPage }) {
  console.log('getMessages');
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({ "recipient": userId, "creator": partnerId, "requestedPage": requestedPage, "requestedRecordsNumber": 20 });
  console.log('getMessages body', raw)
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  return apiRequest(
    `${Config.NAMIQUI_GATEWAY}/api/users/chat/messaging/get`,
    requestOptions,
    'getMessages',
  );
}

export async function updateMessages({ token, userId, partnerId, text }) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({ "recipientId": partnerId, "message": { "userId": userId, "text": text, "system": false, "sent": true, "received": true, "pending": false, "quickReplies": "", "image": "", "video": "", "audio": ""} });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  return apiRequest(
    `${Config.NAMIQUI_GATEWAY}/api/users/chat/messaging/save`,
    requestOptions,
    'updateMessages',
  );
}