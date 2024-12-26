 
import AsyncStorage from '@react-native-async-storage/async-storage';


let Token; 

const checkLoginStatus = async (title, body) => {
      try {
        const value = await AsyncStorage.getItem('NotificationToken');
        if (value !== '') {
          const Token = JSON.parse(value);
          sendPushNotification(Token , title, body)
        } else {
          Token = null;
        }
      } catch (error) {
        console.error('Error checking Token', error);
        ; // Default to showing onboarding if there's an error
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const data = await response.json();
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  };


  module.exports = checkLoginStatus