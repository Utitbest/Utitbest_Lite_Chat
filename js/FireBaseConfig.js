
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js';
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, updateDoc, deleteDoc, setDoc, onSnapshot, where, 
  serverTimestamp, query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, getMetadata,} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-storage.js";


export default class FirebaseService {
  constructor(config) {
    this.app = initializeApp(config);
    this.db = getFirestore(); 
    this.auth = getAuth();
    this.storage = getStorage();
    this.unsubscribers = {};
    this.lastCheckTime = {};
    this.UserName = null;

  }

  showToast(message, type = "success") {
    Toastify({
      text: message,
      duration: 4000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: type === "success" ? "green" : "red",
    }).showToast();
  }

  



async getCurrentUserId() {
  const user = this.auth.currentUser;
  if (user) {
      return user.uid;
  } else {
      throw new Error("No user is currently logged in.");
  }
}

  async createDocument(collectionName, data) {
    try {
      const docRef = await addDoc(collection(this.db, collectionName), data);
      this.showToast("Document created successfully!");
      return docRef.id;
    } catch (error) {
      this.showToast(`Error creating document: ${error.message}`, "error");
      throw error;
    }
  }

  async readDocument(collectionName, documentId) {
    try {
      const docRef = doc(this.db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.showToast("Document retrieved successfully!");
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        this.showToast("No such document found", "error");
        return null;
      }
    } catch (error) {
      this.showToast(`Error reading document: ${error.message}`, "error");
      throw error;
    }
  }

  async readAllDocuments(collectionName) {
    try {
      const snapshot = await getDocs(collection(this.db, collectionName));
      this.showToast("All documents retrieved successfully!");
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      this.showToast(`Error reading documents: ${error.message}`, "error");
      throw error;
    }
  }

  async updateDocument(collectionName, documentId, data) {
    try {
      const docRef = doc(this.db, collectionName, documentId);
      await updateDoc(docRef, data);
      this.showToast("Document updated successfully!");
    } catch (error) {
      this.showToast(`Error updating document: ${error.message}`, "error");
      throw error;
    }
  }

async deleteDocument(collectionName, documentId) {
    try {
      const docRef = doc(this.db, collectionName, documentId);
      await deleteDoc(docRef);
      this.showToast("Document deleted successfully!");
    } catch (error) {
      this.showToast(`Error deleting document: ${error.message}`, "error");
      throw error;
    }
  }

async registerUser(credentials, userData) {
    try {
      const { email, password } = credentials;
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const userId = userCredential.user.uid;

      await setDoc(doc(this.db, "users", userId), {
        uid: userId,
        ...userData,
        isActive: true,
        lastActive: serverTimestamp(),
        createdAt: new Date()
      });

      this.showToast("User registered successfully!");
      return userId;
    } catch (error) {
      this.showToast(`Error registering user: ${error.message}`, "error");
      throw error;
    }
}

async getUserData(uid) {
    const userDoc = await getDoc(doc(this.db, "users", uid));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() }; // Return user data along with the ID
    } else {
      throw new Error("User not found");
    }
}
async loginUser(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.showToast("Login successful!");
      return userCredential.user.uid;
    } catch (error) {
      this.showToast(`Error logging in: ${error.message}`, "error");
      throw error;
    }
}

async getAllUsers() {
    try {
        const usersSnapshot = await getDocs(collection(this.db, "users"));
        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return users;
    } catch (error) {
        console.error("Error retrieving users:", error);
        throw error;
    }
}

async sendMessage(chatId, senderId, recipientId, messageContent) {
  try {
      const chatRef = doc(this.db, "chats", chatId);
      const chatMessagesRef = collection(chatRef, "messages");
      const chatDoc = await getDoc(chatRef);

      if (!chatDoc.exists()) {
          await setDoc(chatRef, {
              lastMessage: messageContent,
              lastMessageTimestamp: serverTimestamp(),
              participants: [senderId, recipientId],
          });
      }

      const messageData = {
        senderId,
        recipientId,
        content: messageContent,
        timestamp: serverTimestamp(), 
        Status: false
    };
    
      await addDoc(chatMessagesRef, messageData);

      await updateDoc(chatRef, {
          lastMessage: messageContent,
          lastMessageTimestamp: serverTimestamp(),
      });

      
  } catch (error) {
      this.showToast(`Error sending message: ${error}`, "error");
      // console.error("Error sending message:", error);
  }
}

async getLastMessage1(chatId) {
  const chatDoc = await getDoc(doc(this.db, "chats", chatId));
  if (chatDoc.exists()) {
      const chatData = chatDoc.data();
      return {
          text: chatData.lastMessage || "No messages yet",
          timestamp: chatData.lastMessageTimestamp,
      };
  }
  if(!chatDoc.exists()){
    return {
      text: "No messages yet",
      timestamp: '', 
    };
  }
  
}

async listenForMessages(chatId, callback) {
  try {
      const messagesRef = collection(this.db, "chats", chatId, "messages");
      const q = query(messagesRef, orderBy("timestamp", "asc"));

      onSnapshot(q, (snapshot) => {
          const messages = snapshot.docs.map((doc) => {
              const data = doc.data();
             
              const validTimestamp = data.timestamp || { seconds: 0, nanoseconds: 0 };

              return {
                  id: doc.id,
                  ...data,
                  timestamp: validTimestamp || null, 
              };
          });

          callback(messages);
      });
  } catch (error) {
      this.showToast(`Error listening for message: ${error}`);
  }
}

async listenForMessages11() {
  try {
    const currentUser = getAuth().currentUser;
    if (!currentUser) {
      console.error("No user is logged in.");
      return;
    }

    const chatsRef = collection(this.db, "chats");
    onSnapshot(chatsRef, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        const chatId = doc.id;
        const messagesRef = collection(this.db, "chats", chatId, "messages");
        const q = query(messagesRef, orderBy("timestamp", "asc"));

        onSnapshot(q, (messagesSnapshot) => {
          messagesSnapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const data = change.doc.data();
              const messageId = change.doc.id             
              const senderId = data.senderId;
              const receiverId = data.recipientId;
              if (receiverId === currentUser.uid) {
                this.notifyUser(senderId, data);
                this.notifyUser12(senderId, data, messageId, chatId);
              }
              if (senderId === currentUser.uid) {
                this.notifyUser(receiverId, data);
              }
            }
          });
        });
      });
    });
  } catch (error) {
    // console.error("Error listening for messages:", error);
    this.showToast(`Error listening for message: ${error}`);
  }
}

notifyUser(userId, message) {
  const userTag = document.querySelector(`.individualchat[data-user-id="${userId}"]`)

  if (userTag) {
    userTag.querySelector(".username_chat p").textContent = message.content;

    if(typeof message.content === 'string') {
      userTag.querySelector(".username_chat p").textContent = message.content;
    }else if (message.content?.type) {
      userTag.querySelector(".username_chat p").textContent = `${message.content.type.toUpperCase()} File Sent`;
    }else {
      userTag.querySelector(".username_chat p").textContent = 'Unknown Message Type';
    }
    let abi;
    if (message.timestamp && message.timestamp.seconds) {
      abi = message.timestamp.seconds; 
    } else if (message.timestamp && message.timestamp.toDate()) {
      abi = Math.floor(message.timestamp.toDate().getTime() / 1000); // Convert to seconds
    } else {
      abi = Math.floor(Date.now() / 1000);
    }
    userTag.querySelector('.times p').textContent = this.getRelativeTime1(abi);
    if(userTag.querySelector('.times p').textContent.length > 7){
      userTag.querySelector('.times p').textContent = userTag.querySelector('.times p').textContent.slice(0, 7) + '...';
    }
    const userlist = document.querySelector('.secondusers')
    
    if(userlist && userlist.firstElementChild !== userTag) {
      userlist.removeChild(userTag);
      userlist.prepend(userTag);
    }
  } else {
    console.warn(`User tag for sender ${userId} not found.`);
  }
}

getRelativeTime1(timestamp) {
  if(timestamp == null){
      return ''
  }
  const currentTime = new Date();
  const messageTime = new Date(timestamp * 1000); 
  const timeDiff = currentTime - messageTime; 

  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''}`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''}`;
  if (days > 0) {
      return days === 1 ? 'Yesterday' : `${days}days ago`;
  }
  if (hours > 0) return `${hours}hr${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `${minutes}min${minutes > 1 ? 's' : ''}`;
  return `just now`;

}

/////////////////////////////////////////////////////////////////////////
// async listenForAllChats() {
//   const auth = getAuth();
//   const currentUserId = auth.currentUser?.uid;
//   const chatsRef = collection(this.db, "chats");

//   const q = query(chatsRef, where("participants", "array-contains", currentUserId));

//   onSnapshot(q, (snapshot) => {
//       snapshot.docs.forEach((chatDoc) => {
//           const chatId = chatDoc.id;
//           // console.log(chatId)
//           this.listenForNewMessages(chatId); // Call the message listener for each chat
//       });
//   });
// }

// async listenForNewMessages(chatId) {
//   const auth = getAuth();
//   const currentUserId = auth.currentUser?.uid;
//   const messagesRef = collection(this.db, "chats", chatId, "messages");
//   console.log(currentUserId)
//   // Ensure only new messages are tracked
//   let lastCheckTime = new Date(); 

//   onSnapshot(
//       query(messagesRef, orderBy("timestamp", "asc")),
//       (snapshot) => {
//           snapshot.docChanges().forEach((change) => {
//               const messageData = change.doc.data();
//               const messageTimestamp = messageData.timestamp?.toDate() || new Date(0);

//               // Notify only if it's a new message meant for the current user
//               if (
//                   change.type === "added" &&
//                   messageData.senderId !== currentUserId &&
//                   messageData.recipientId === currentUserId &&
//                   messageTimestamp > lastCheckTime
//               ) {
//                   console.log(`New message from chat ${chatId}:`, messageData.text);
//                   // this.showNotification("New Message", messageData.text);
//                   lastCheckTime = new Date();
//               }
//           });
//       }
//   );
// }
////////////////////////////////////////////////////////////////////////////

async listenForAllChats() {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  if (!currentUser) {
      console.error("User not logged in.");
      return;
  }

  const currentUserId = currentUser.uid;
  const chatsRef = collection(this.db, "chats");


  // Unsubscribe previous listener if exists
  if (this.unsubscribers.allChats) {
      this.unsubscribers.allChats();
  }

  // Set a single listener for all chats
  const q = query(chatsRef, where("participants", "array-contains", currentUserId));
  this.unsubscribers.allChats = onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach((chatDoc) => {
          const chatId = chatDoc.id;
          if (!this.lastCheckTime[chatId]) {
              this.lastCheckTime[chatId] = new Date();
          }
          this.listenForNewMessages(chatId, currentUserId);
      });
  });
}

async listenForNewMessages(chatId, currentUserId) {
  const messagesRef = collection(this.db, "chats", chatId, "messages");
  
  const notify = new Audio('./mixkit-correct-answer-tone-2870.wav')
  // Unsubscribe previous listener for this chat if exists
  if (this.unsubscribers[chatId]) {
      this.unsubscribers[chatId]();
  }

  // Set a new listener
   this.unsubscribers[chatId] =  onSnapshot(
    query(messagesRef, orderBy("timestamp", "asc")),
      (snapshot) => {
          snapshot.docChanges().forEach( async (change) => {
              const messageData = change.doc.data();
              const messageTimestamp = messageData.timestamp?.toDate() || new Date(0);
              const userRef = await this.getUserData(messageData.senderId)
              if (
                  change.type === "added" &&
                  messageData.senderId !== currentUserId &&
                  messageData.recipientId === currentUserId &&
                  messageTimestamp > this.lastCheckTime[chatId]
              ) {
                  console.log(messageData.senderId)
                  this.UserName = userRef.firstname + ' ' + userRef.lastname
                  this.lastCheckTime[chatId] = new Date();
                  this.showNotification(this.UserName, messageData.content);
                  notify.play()
              }
          });
      }
  );
}


showNotification(title, message) {
    if (Notification.permission === 'granted') {
        new Notification(title, {
            body: message,
            icon: './Super icons/pardd.png'
        });
    }
}

notifyUser12(senderId, message, messageId, chatId){
  const userTag = document.querySelector(`.individualchat[data-user-id="${senderId}"]`)
  const sww = userTag.querySelector('.times span .whatsappna')
  if(sww){
    if(!message.Status){
      sww.style.backgroundColor = '#0a70ea';
    }else{
      sww.style.backgroundColor = '';
    }
  }
  userTag.addEventListener('click', () =>{
    sww.style.backgroundColor = '';
    this.markMessageAsSeen(chatId, messageId);
  })
}

async markMessageAsSeen(chatId, messageId) {
try {

const messageRef = doc(this.db, "chats", chatId, "messages", messageId);

const messageSnapshot = await getDoc(messageRef);
if (!messageSnapshot.exists()) {
  console.error("No document found for messageId:", messageId);
  return; // Exit if the document does not exist
}

await updateDoc(messageRef, {Status: true});

} catch (error) {
console.error("Error marking message as seen:", error);
this.showToast(`Error marking message as seen: ${error}`);
}
}


}
