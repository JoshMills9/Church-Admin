import React, {useLayoutEffect, useState} from "react";
import { View, Text, Pressable, Modal, StatusBar, Image, TouchableOpacity, ScrollView, FlatList, TouchableHighlight } from "react-native";
import { getFirestore, collection, getDocs,query,where, doc} from "firebase/firestore";

import { Ionicons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { getAuth,} from 'firebase/auth';



export default function MemberList ({navigation}){



    const [showMembers, setshowMembers] = useState(null)
    const db = getFirestore()
    const auth = getAuth()
    const [Id, setId] = useState(null)


    useLayoutEffect(() =>{
         // Step 1: Retrieve user email from Firebase authentication
         const getMember = async() => {

            const user = auth.currentUser;
        if (!user) {
            throw new Error("No user signed in");
        }
        const userEmail = user.email;
   
        // Step 2: Fetch church details based on user email
        const tasksCollectionRef = collection(db, 'UserDetails');
        const querySnapshot = await getDocs(tasksCollectionRef);

        if (!querySnapshot.empty) {
            // Filter tasks to find matching church based on user email
            const tasks = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data().userDetails
            }));

            const church = tasks.find(item => item.email === userEmail);
            setId(church.id)

            try {
                // Reference to the UserDetails document
                const userDetailsDocRef = doc(db, 'UserDetails', church.id);
        
                // Reference to the Members subcollection within UserDetails
                const membersCollectionRef = collection(userDetailsDocRef, 'Members');
        
                // Get all documents from the Members subcollection
                const querySnapshot = await getDocs(membersCollectionRef);
        
                if (!querySnapshot.empty) {
                    // If documents are found, extract their data and update the state with the tasks
                    const tasks = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data().Member}));
                        setshowMembers(tasks)
        
            }else {
                console.log('No updates');
            }
        }
            catch (error) {
                console.log("Error getting member documents:", error);
            }
            }else {
                throw new Error("No church details found in database");
            }


            
        }
        getMember()
    }, [db, navigation])

  
    const getMember =(first, second) =>{
        const Member = showMembers.filter(item => item.FirstName === first  && item.SecondName === second)
        navigation.replace("Details", {member: Member , id : Id})
    }

   
    return(
        <View style={{flex:1}}>

            <StatusBar barStyle={"dark-content"} backgroundColor={"white"}/>


            <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-between",marginBottom:20}}>
                    <View style={{height:70,width:"18%",justifyContent:"center",borderBottomRightRadius:50,padding:10,borderTopRightRadius:50, backgroundColor:"white",elevation:6}}>
                        <Ionicons name="arrow-back" size={35}  color={"rgba(0, 0, 128, 0.8)"} onPress={()=> navigation.navigate('ModalScreen',{username:"", ChurchName:""})}/>
                    </View>

                    <View style={{height:70, width:"80%",flexDirection:"row", alignItems:"center", justifyContent:"space-around", elevation:6, borderBottomRightRadius:60, borderTopLeftRadius:50,borderBottomLeftRadius:50, backgroundColor:"white" }}>
                        <Text style={{fontSize:20,fontWeight:"800",color:"rgba(0, 0, 128, 0.8)"}}>Members List</Text>
                        <Ionicons name="people-sharp" size={26} color={"navy"} />
                    </View>
            </View>

            <FlatList 

             data={showMembers}

             ListEmptyComponent={()=>(
             <View style={{flex:1,padding:50, justifyContent:"center",alignItems:"center"}}>
                <Text style={{fontSize:15,fontWeight:"300"}}>Fetching Data ...</Text>
             </View>
             )}

             keyExtractor={(item)=> item.FirsttName + item.Number1}
             renderItem={({item , index}) => {
                return(

                    <View style={{flex:1,margin:5}}>
                                            

                    <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-around"}}>
                        <View style={{height:40,width:"16%",justifyContent:"center", borderTopLeftRadius:20,borderBottomRightRadius:50,padding:10, backgroundColor:"white",elevation:3}}>
                            {item.Image ?
                                        <Image source={{uri: item.Image}} borderRadius={50}  width={30} height={30} />
                                        :
                                        <View style={{width:30,height:30 ,borderRadius:50,borderWidth:1,alignItems:'center',justifyContent:'center'}}>
                                            <Fontisto name="person"  size={20} color={"gray"}/>
                                        </View>
                        
                            }
                        </View>

                        <>
                            <TouchableHighlight onPress={()=>{getMember(item.FirstName, item.SecondName)}} underlayColor="#ccc" style={{height:40, width:"80%",paddingLeft:25, paddingRight:10,elevation:1, alignItems:"center",flexDirection:"row", justifyContent:"space-between", borderBottomRightRadius:50, borderTopRightRadius:50, borderTopLeftRadius:80,borderBottomLeftRadius:15, backgroundColor:"white" }}>
                                <><Text style={{fontSize:18,fontWeight:"400"}}>{item.FirstName} {item.SecondName}</Text>
                                <MaterialIcons name="arrow-right" size={25} color="gray" />
                                </>
                            </TouchableHighlight>
                        </>
                    </View>
                    </View>
             )}}
            />
        </View>
    )
}