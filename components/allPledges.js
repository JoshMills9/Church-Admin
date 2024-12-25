import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, Text, FlatList, Alert,useColorScheme, ToastAndroid } from "react-native";

import {
  getFirestore,
  doc,
  addDoc,
  collection,
  setDoc,
  updateDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import {  Searchbar } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';



export default function AllPledges() {
  const [Pledges, setPledges] = useState([]);
  const [NoOfPleges, setNoOfPledges] = useState(null);
  const auth = getAuth();
  const db = getFirestore();
  const [search, setSearch] = useState("")
  const [seen, setSeen] = useState(true)
  const isDarkMode = useColorScheme() === 'dark';

  const [redeemed, setRedeemed] = useState(false)

    const getMember = async (email) => {

      try {
        // Fetch church details based on user email
        const tasksCollectionRef = collection(db, "UserDetails");
        const querySnapshot = await getDocs(tasksCollectionRef);

        if (!querySnapshot.empty) {
          const tasks = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data().userDetails,
          }));

          const church = tasks.find((item) => item.email === email);

          // Fetch pledges
          const userDetailsDocRef = doc(db, "UserDetails", church.id);
          const eventsCollectionRef = collection(userDetailsDocRef, "Pledges");
          const eventsSnapshot = await getDocs(eventsCollectionRef);

          if (!eventsSnapshot.empty) {
            const Data = eventsSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data().Pledges,
            }));
                          // Normalize the data
              const normalizedData = Data.map(item => {
                // If the object has a key like '0', extract it and use it as the object
                if (item["0"]) {
                  return item["0"];
                }
                return item;  // Else, return the object as it is
              });

              if(normalizedData.filter(i => !i.Redeemed)){
                const notRedeemed = normalizedData.filter(i => !i.Redeemed)
                setPledges(notRedeemed.filter(i => i.FullName));
                setNoOfPledges(notRedeemed.filter(i => i.FullName).length);
              }else{
                setPledges([]);
                setSeen(false)
              }
           
          }else{
            ToastAndroid.show("Please make a pledge!", ToastAndroid.SHORT)
            setSeen(false)
            return
          }
        } else{
          Alert.alert("Server Error!", error.message);
        }
      } catch (error) {
        Alert.alert("Error", error.message);
        console.log("Error fetching data:", error);
      }
    };


     //update pledge functionality
     const [pledgeList, setPledgeList] = useState([]);
 
     const handlePledge = (id) => {
             Pledges.map((pledge) => {
                 if (pledge.id === id) {
                     const updatedPledge = { ...pledge, Redeemed: !pledge.Redeemed }; // Toggle the Check status
                     // Handle attendance list update if the checkbox is checked
                     if (updatedPledge.Redeemed) {
                        return setPledgeList((prevList) => [updatedPledge, ...prevList]);
                     } else {
                         setPledgeList([]); // Clear the attendance list if unchecked
                     }
                     return updatedPledge;
                 }
             });
     };
   



    //add attendance to db
    const updatePledge = async(Email, id) => {

    if (pledgeList?.length >= 0 ){
      ToastAndroid.show("Please wait...", ToastAndroid.LONG)

        try {
    
            // Step 2: Fetch church details based on user email
            const tasksCollectionRef = collection(db, 'UserDetails');
            const querySnapshot = await getDocs(tasksCollectionRef);
    
            if (!querySnapshot.empty) {
                // Filter tasks to find matching church based on user email
                const tasks = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data().userDetails
                }));
    
                const church = tasks.find(item => item.email === Email);
    
                if (!church) {
                    throw new Error("Church details not found for the logged-in user");
                }
    
                // Reference to the UserDetails document
            const userDetailsDocRef = doc(db, 'UserDetails', church.id);
    
            // Reference to the Pledges subcollection within UserDetails
            const membersCollectionRef = doc(userDetailsDocRef, 'Pledges', id);
    
            // Set a document within the Pledges subcollection
            await updateDoc(membersCollectionRef, {Pledges: pledgeList});
            setRedeemed(true)
            getMember(Email)
            ToastAndroid.show("Pledge redeemed successfully!", ToastAndroid.LONG);

            } else {
                throw new Error("No church details found in database");
            }
    
        
    
        } catch (error) {
            console.error("Error adding document: ", error);
            ToastAndroid.show(`Error redeeming pledge: ${error.message}`, ToastAndroid.LONG);
        }
    } else{
        ToastAndroid.show("Please redeem a pledge!", ToastAndroid.LONG);
        return;
    }

    }




    const [email, setEmail] = useState()


  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('UserEmail');
        if (value !== '') {
          getMember(value)
          setEmail(value)
        } else {
          console.log("no item")
        }
      } catch (error) {
        console.error('Error checking onboarding status', error);
      }
    };
    checkLoginStatus()
  }, []);



  const searchQueryHandler = (text) => {
    if (text) {
       setSearch(text)
    } else {
      setSearch("")
    }
};




  
  return (
    <View style={{ flex: 1 }}>

      <Searchbar iconColor={isDarkMode ? '#FFFFFF' : '#000000'}  elevation={2} style={{backgroundColor:isDarkMode ? "rgba(50, 50, 50, 1)" : "white",marginBottom:6}} value={search} 
       onChangeText={(text)=> {searchQueryHandler(text)}} placeholderTextColor={'gray'} placeholder="Search by name"/>

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 16, color:  isDarkMode ? '#FFFFFF' : '#000000'}}>
          Total No. of Pledges : {NoOfPleges ? NoOfPleges : "-"}
        </Text>
      </View>


      <View style={{flex:1 , justifyContent: Pledges?.length !== 0 ? "flex-start" : "center" , }}>
      {Pledges?.length !== 0 ?
          <FlatList
            data={Pledges?.filter(i => !i.Redeemed).sort((a, b) => b.createdAt - a.createdAt).filter(member => 
              member.FullName && (member.FullName.toLowerCase().includes(search.toLowerCase())))}

            keyExtractor={(index, item) => item.FullName}
            ListEmptyComponent={() => (
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: isDarkMode ? '#FFFFFF' : '#000000'}}>
                  Not Found!
                </Text>
              </View>
            )}
            renderItem={({ item, index }) => (
              <View>
                <TouchableOpacity
                  onPress={() => {handlePledge(item.id);
                    Alert.alert("", "CONFIRM PAYMENT", [
                      { text: "Cancel", onPress: () => {} , style: "cancel" },
                      { text: "Redeem", onPress: () => updatePledge(email, item.id)},
                    ]);
                  }}
                  style={{
                    backgroundColor:isDarkMode?  "rgba(50, 50, 50, 1)" :"white",
                    elevation: 5,
                    margin: 10,
                    justifyContent: "space-evenly",
                    padding: 15,
                    height: 210,
                    borderRadius: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        marginBottom: 15,
                        fontSize: 16,
                        color:  isDarkMode ? '#FFFFFF' : '#000000',
                        textDecorationLine:"underline"
                      }}
                    >
                      Date Issued:
                    </Text>
                    <Text
                      style={{
                        marginBottom: 15,
                        fontSize: 16,
                        color: " rgba(100, 200, 255, 1)",
                      }}
                    >
                      {" "}
                      {item.PledgeDate}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        marginBottom: 10,
                        fontSize: 16,
                        color: isDarkMode ? '#FFFFFF' : '#000000',
                      }}
                    >
                      Title Of Pledge :
                    </Text>
                    <Text
                      adjustsFontSizeToFit={true}
                      numberOfLines={1}
                      style={{
                        marginBottom: 10,
                        fontSize: 16,
                        color: " rgba(100, 200, 255, 1)",
                        width:"50%",
                        alignItems:"center",
                        justifyContent:"center"
                      
                      }}
                    >
                      {item.Title}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        marginBottom: 10,
                        fontSize: 16,
                        color: isDarkMode ? '#FFFFFF' : '#000000',
                      }}
                    >
                      Name :
                    </Text>
                    <Text
                      adjustsFontSizeToFit={true}
                      numberOfLines={1}
                      style={{
                        marginBottom: 10,
                        fontSize: 16,
                        color: " rgba(100, 200, 255, 1)",
                        width:"50%",
                        alignItems:"center",
                        justifyContent:"center"
                      
                      }}
                    >
                      {item.FullName}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        marginBottom: 10,
                        fontSize: 16,
                        color: isDarkMode ? '#FFFFFF' : '#000000',
                      }}
                    >
                      Contact :
                    </Text>
                    <Text
                      adjustsFontSizeToFit={true}
                      numberOfLines={1}
                      style={{
                        marginBottom: 10,
                        fontSize: 16,
                        color: " rgba(100, 200, 255, 1)",
                        width:"50%",
                        alignItems:"center",
                        justifyContent:"center"
                      
                      }}
                    >
                      {item.Number1}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        marginBottom: 10,
                        fontSize: 16,
                        color: isDarkMode ? '#FFFFFF' : '#000000',
                      }}
                    >
                      Amount :
                    </Text>
                    <Text
                      adjustsFontSizeToFit={true}
                      numberOfLines={1}
                      style={{
                        marginBottom: 10,
                        fontSize: 16,
                        color: " rgba(100, 200, 255, 1)",
                        width:"50%",
                        alignItems:"center",
                        justifyContent:"center"
                      
                      }}
                    >
                      GH₵ {item.Amount}.00
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        marginBottom: 10,
                        fontSize: 16,
                        color:  isDarkMode ? '#FFFFFF' : '#000000',
                      }}
                    >
                      MoP :
                    </Text>
                    <Text
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}
                        style={{
                          marginBottom: 10,
                          fontSize: 16,
                          color: " rgba(100, 200, 255, 1)",
                          width:"50%",
                          alignItems:"center",
                          justifyContent:"center"
                        
                        }}
                    >
                      {item.ModeOfPayment}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: isDarkMode ? '#FFFFFF' : '#000000',
                      }}
                    >
                      Duration :
                    </Text>
                    <Text
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}
                        style={{
                          fontSize: 16,
                          color: " rgba(100, 200, 255, 1)",
                          width:"50%",
                          alignItems:"center",
                          justifyContent:"center"
                        
                        }}
                    >
                      {item.Duration}
                    </Text>
                  </View>

                  {item?.Redeemed && <Ionicons name="checkmark-done" size={20} color={'lightgray'} style={{alignSelf:"flex-end"}} />}
                </TouchableOpacity>
              </View>
            )}
          />
          :
          <View style={{alignItems:"center",justifyContent:"center",alignSelf:"center", backgroundColor: isDarkMode ? 'rgba(100, 100, 100, 0.2)' : "lightgray",width:230, height:45, borderRadius:10}}>
            <Text style={{color: isDarkMode ? '#FFFFFF' : '#000000'}}>{ seen ? "Loading ..." : "No Pledges"}</Text>
          </View>
          }
      </View>  
    </View>
  );
}
