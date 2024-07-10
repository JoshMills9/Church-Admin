import React, {useLayoutEffect, useState} from "react";
import { View, Text, Pressable, Modal, StatusBar, Image, TouchableOpacity, ScrollView, FlatList, TouchableHighlight } from "react-native";
import { getFirestore, collection, getDocs,query,where, doc} from "firebase/firestore";

import { Ionicons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { getAuth,} from 'firebase/auth';
import { useNavigation } from "@react-navigation/native";



export default function MemberList ({route}){
    const {params} = route || {};
    const navigation = useNavigation()

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
        navigation.navigate("Details", {member: Member , id : Id, username: params?.username, ChurchName: params.ChurchName, mainEmail: params.mainEmail, admin: params.admin, role: params.role , newAdmin: params.newAdmin, users: params.users, events: params.events})
    }

   
    return(
        <View style={{flex:1, backgroundColor:"rgba(30, 30, 30, 1)"}}>

            <StatusBar barStyle={"light-content"} backgroundColor={"rgba(50, 50, 50, 1)"}/>


            <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-between",marginBottom:20}}>
                    <View style={{height:70,width:"18%",justifyContent:"center",borderBottomRightRadius:50,padding:10,borderTopRightRadius:50, backgroundColor:"rgba(50, 50, 50, 1)",elevation:6}}>
                        <Ionicons name="arrow-back" size={35}  color={"rgba(240, 240, 240, 1)"} onPress={()=> navigation.navigate('ModalScreen',{username: params?.username, ChurchName: params.ChurchName, mainEmail: params.mainEmail, admin: params.admin, role: params.role , newAdmin: params.newAdmin, users: params.users, events: params.events})}/>
                    </View>

                    <View style={{height:70, width:"80%",flexDirection:"row", alignItems:"center", justifyContent:"space-around", elevation:6, borderBottomRightRadius:60, borderTopLeftRadius:50,borderBottomLeftRadius:50, backgroundColor:"rgba(50, 50, 50, 1)" }}>
                        <Text style={{fontSize:20,fontWeight:"800",color:"rgba(240, 240, 240, 1)"}}>Members List</Text>
                        <Ionicons name="people-sharp" size={26} color={"rgba(240, 240, 240, 1)"} />
                    </View>
            </View>

            <FlatList 

             data={showMembers}

             ListEmptyComponent={()=>(
             <View style={{flex:1,padding:50, justifyContent:"center",alignItems:"center"}}>
                <Text style={{fontSize:15,fontWeight:"300",color:"rgba(240, 240, 240, 1)"}}>Fetching Data ...</Text>
             </View>
             )}

             keyExtractor={(item)=> item.FirsttName + item.Number1}
             renderItem={({item , index}) => {
                return(

                    <View style={{flex:1,paddingHorizontal:15,paddingVertical:8}}>
                                            

                    <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-around"}}>
                       
                            <>
                                <TouchableHighlight onPress={()=>{getMember(item.FirstName, item.SecondName)}} underlayColor="rgba(70, 70, 70, 1)" style={{height:50, width:"100%",paddingHorizontal:10,elevation:2, alignItems:"center",flexDirection:"row", justifyContent:"space-between", borderBottomRightRadius:50, borderTopRightRadius:50, borderTopLeftRadius:50,borderBottomLeftRadius:50, backgroundColor:"rgba(50, 50, 50, 1)" }}>
                                    <><View style={{flexDirection:"row", justifyContent:"flex-start",alignItems:"center"}}>
                                        {item.Image ?
                                                    <Image source={{uri: item.Image}} borderRadius={50}  width={30} height={30} />
                                                    :
                                                    <View style={{width:30,height:30 ,borderRadius:50,borderWidth:1,alignItems:'center',justifyContent:'center'}}>
                                                        <Fontisto name="person"  size={20} color={"gray"}/>
                                                    </View>
                                    
                                        }
                                        <Text style={{fontSize:18,fontWeight:"400",color:"rgba(240, 240, 240, 1)",marginLeft:20}}>{item.FirstName} {item.SecondName}</Text>
                                    </View>
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