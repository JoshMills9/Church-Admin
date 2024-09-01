import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, Text, FlatList, Alert } from "react-native";

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

import AsyncStorage from '@react-native-async-storage/async-storage';



export default function AllPledges() {
  const [Pledges, setPledges] = useState(null);
  const [NoOfPleges, setNoOfPledges] = useState(null);
  const auth = getAuth();
  const db = getFirestore();
  const [search, setSearch] = useState("")




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

          // Fetch events
          const userDetailsDocRef = doc(db, "UserDetails", church.id);
          const eventsCollectionRef = collection(userDetailsDocRef, "Pledges");
          const eventsSnapshot = await getDocs(eventsCollectionRef);

          if (!eventsSnapshot.empty) {
            const Data = eventsSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data().Pledges,
            }));
              setPledges(Data);
              setNoOfPledges(Data.length);
           
          }
        } else {
          Alert.alert("Server Error!", error);
        }
      } catch (error) {
        Alert.alert("Error", error.message);
        console.log("Error fetching data:", error);
      }
    };




  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('UserEmail');
        if (value !== '') {
          getMember(value)
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

      <Searchbar iconColor="rgba(240, 240, 240, 1)"  elevation={2} style={{backgroundColor:"rgba(50, 50, 50, 1)",marginBottom:6}} value={search} 
       onChangeText={(text)=> {searchQueryHandler(text)}} placeholderTextColor={'gray'} placeholder="Search by name"/>

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 16, color: "rgba(240, 240, 240, 1)" }}>
          Total No. of Pledges : {NoOfPleges ? NoOfPleges : "-"}
        </Text>
      </View>

      <FlatList
        data={Pledges?.sort((a, b) => b.createdAt - a.createdAt).filter(member => 
          member.FullName && (member.FullName.toLowerCase().includes(search.toLowerCase())))}

        keyExtractor={(index, item) => item.id?.toString()}
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "rgba(240, 240, 240, 1)" }}>
              Fetching Data...
            </Text>
          </View>
        )}
        renderItem={({ item, index }) => (
          <View>
            <TouchableOpacity
              onPress={() => {
                Alert.alert("", "CONFIRM PAYMENT", [
                  { text: "Redeemed", onPress: () => {} },
                  { text: "Remove", onPress: () => {}, style: "cancel" },
                ]);
              }}
              style={{
                backgroundColor: "rgba(50, 50, 50, 1)",
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
                    color: "rgba(240, 240, 240, 1)",
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
                    color: "rgba(240, 240, 240, 1)",
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
                    color: "rgba(240, 240, 240, 1)",
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
                    color: "rgba(240, 240, 240, 1)",
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
                  {item.Contact}
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
                    color: "rgba(240, 240, 240, 1)",
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
                  GHC {item.Amount}.00
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
                    color: "rgba(240, 240, 240, 1)",
                  }}
                >
                  Mode Of Payment :
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
                    marginBottom: 10,
                    fontSize: 16,
                    color: "rgba(240, 240, 240, 1)",
                  }}
                >
                  Duration :
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
                  {item.Duration}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
