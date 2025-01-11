// const WebSocket = require('ws');
// const admin = require('firebase-admin');
// const path = require('path');

// // Initialize Firebase Admin SDK with service account credentials
// admin.initializeApp({
//     credential: admin.credential.cert(path.join(__dirname, 'utitbest-realchat-firebase-adminsdk-qcdcq-c8053925da.json'))
// });

// const db = admin.firestore();

// // Create a WebSocket server on port 8080
// const wss = new WebSocket.Server({ port: 8080 });

// wss.on('connection', (ws) => {
//     console.log('✅ New client connected');

//     // Listen for messages from clients
//     ws.on('message', async (message) => {
//         try {
//             const data = JSON.parse(message);

//             if (data.type === 'online' || data.type === 'offline') {
//                 // Update the user's status in Firestore
//                 await db.collection('users').doc(data.userId).update({
//                     status: data.type,
//                     lastSeen: admin.firestore.FieldValue.serverTimestamp()
//                 });
//                 console.log(`ℹ️ User ${data.userId} is now ${data.type}`);
//             }

//             // Broadcast the message to all connected clients
//             wss.clients.forEach(client => {
//                 if (client.readyState === WebSocket.OPEN) {
//                     client.send(JSON.stringify(data));
//                 }
//             });
//         } catch (error) {
//             console.error('❌ Error processing message:', error);
//         }
//     });

//     // When a client disconnects
//     ws.on('close', () => {
//         console.log('❌ Client disconnected');
//     });
// });

// console.log('✅ WebSocket server running on ws://localhost:8080');



// // var admin = require("firebase-admin");

// // var serviceAccount = require("path/to/serviceAccountKey.json");

// // admin.initializeApp({
// //   credential: admin.credential.cert(serviceAccount),
// //   databaseURL: "https://utitbest-realchat-default-rtdb.firebaseio.com"
// // });






// server.js
const WebSocket = require('ws');

// Initialize WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket server running on ws://localhost:8080');

wss.on('connection', (ws) => {
    console.log('A user connected');

    // Listen for messages from the client
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
    });

    // Handle disconnection
    ws.on('close', () => {
        console.log('A user disconnected');
    });
});