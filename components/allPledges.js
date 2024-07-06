import React, { useState, useLayoutEffect } from "react";
import { View, Text, FlatList, Alert} from "react-native";

import { getFirestore,doc, addDoc, collection, setDoc, updateDoc,getDocs,deleteDoc, } from "firebase/firestore";
import { getAuth, } from 'firebase/auth';
import { TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";




export default function AllPledges(){
    const [Pledges , setPledges] = useState(null)
    const [NoOfPleges,setNoOfPledges] = useState(null)
    const auth = getAuth()
    const db = getFirestore()



    useLayoutEffect(() => {
        const getMember = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    throw new Error("No user signed in");
                }
                const userEmail = user.email;

                // Fetch church details based on user email
                const tasksCollectionRef = collection(db, 'UserDetails');
                const querySnapshot = await getDocs(tasksCollectionRef);

                if (!querySnapshot.empty) {
                    const tasks = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data().userDetails
                    }));

                    const church = tasks.find(item => item.email === userEmail);

                    // Fetch events
                    const userDetailsDocRef = doc(db, 'UserDetails', church.id);
                    const eventsCollectionRef = collection(userDetailsDocRef, 'Pledges');
                    const eventsSnapshot = await getDocs(eventsCollectionRef);

                    if (!eventsSnapshot.empty) {
                        const Data = eventsSnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data().Pledges
                        }));
                        setPledges(Data);
                        setNoOfPledges(Data.length);
                    }
                   
                }else{
                    Alert.alert("Server Error!",error)
                }
            }catch(error){
                Alert.alert("Error", error.message)
                console.log("Error fetching data:", error);
            }
        };
    

        getMember();
   
    }, []); 


    return(
        <View style={{flex:1}}>

            <View style={{padding:10}}>
                <Text style={{fontSize:16, color:"rgba(240, 240, 240, 1)"}}>
                    Total No. of Pledges : {NoOfPleges ? NoOfPleges : "-"}
                </Text>
            </View>

            <FlatList 
                data={Pledges?.sort((a, b) => b.createdAt - a.createdAt)}
                keyExtractor={(index, item)=> item.id?.toString()}
                ListEmptyComponent={()=>(
                    <View style={{alignItems:"center",}}><Text style={{color:"rgba(240, 240, 240, 1)"}}>Fetching Data ...</Text></View>
                )}
                renderItem={({item, index})=>(
                    <View >
                        <TouchableOpacity onPress={()=>{Alert.alert("","CONFIRM PAYMENT",[{text:"Redeemed",onPress: ()=>{}},{text:"Remove",onPress:()=>{},style:"cancel"}])}} style={{backgroundColor:"rgba(50, 50, 50, 1)",elevation:5, margin:10,justifyContent:"space-evenly",padding:20, height:155,borderRadius:10,}}>
                            <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center"}}><Text style={{marginBottom:15,fontSize:16, color:"rgba(240, 240, 240, 1)"}}>Date Issued :</Text><Text style={{marginBottom:15,fontSize:16, color:" rgba(100, 200, 255, 1)"}}> {item.PledgeDate}</Text></View>
                            <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}><Text style={{marginBottom:10,fontSize:16, color:"rgba(240, 240, 240, 1)"}}>Title Of Pledge :</Text><Text style={{marginBottom:10,fontSize:16, color:" rgba(100, 200, 255, 1)"}}>{item.PledgeTitle}</Text></View>
                            <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}><Text style={{marginBottom:10,fontSize:16, color:"rgba(240, 240, 240, 1)"}}>Name :</Text><Text style={{marginBottom:10,fontSize:16, color:" rgba(100, 200, 255, 1)"}}>{item.FullName}</Text></View>
                            <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}><Text style={{marginBottom:10,fontSize:16, color:"rgba(240, 240, 240, 1)"}}>Amount :</Text><Text style={{marginBottom:10,fontSize:16, color:" rgba(100, 200, 255, 1)"}}>GHC {item.Amount}.00</Text></View>
                            <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}><Text style={{marginBottom:10,fontSize:16, color:"rgba(240, 240, 240, 1)"}}>Mode Of Payment :</Text><Text style={{marginBottom:10,fontSize:16,color:" rgba(100, 200, 255, 1)"}}>{item.ModeOfPayment}</Text></View>
                            <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}><Text style={{marginBottom:10,fontSize:16, color:"rgba(240, 240, 240, 1)"}}>Duration :</Text><Text style={{marginBottom:10,fontSize:16, color:" rgba(100, 200, 255, 1)"}}>{item.Duration}</Text></View>
                        </TouchableOpacity>
                    </View>
                )}
            />


        </View>
    )
}