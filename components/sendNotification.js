 
import { getFirestore, collection, setDoc, updateDoc,getDocs } from "firebase/firestore";

const db = getFirestore()
let Token; 




const checkToken = async (title, body) => {
    try {
        const tasksCollectionRef = collection(db, 'deviceTokens');
        const querySnapshot = await getDocs(tasksCollectionRef);

        if (!querySnapshot.empty) {
            // Filter tasks to find matching church based on user email
            const tokens = querySnapshot.docs.map(doc => ({
                ...doc.data()
            }));
            Token = tokens.map(t => t.token)
            sendPushNotification(Token , title, body)
        }
      } catch (error) {
        console.error('Error retrieving tokens:', error);
        return [];
      }

    };

    

 // Function to send a push notification
 const sendPushNotification = async (Token, title, body) => {
    if (!Token) {
      console.log('Error', 'Push token not available.');
      return;
    }

    const message = {
      to: Token, // Replace this with an array of tokens for multiple users
      title: title,
      body: body,
      sound: 'default',
    };

    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
        body: JSON.stringify(message),
      });

      const data = await response.json();
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  };


  module.exports = checkToken