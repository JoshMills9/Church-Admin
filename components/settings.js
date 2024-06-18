import React, { useEffect, useLayoutEffect, useState ,useRef} from "react";
import { TextInput, View, Text,Pressable, FlatList, Image, TouchableOpacity,Alert, StatusBar, Modal } from "react-native";
import styles from "./styles";
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import ModalScreen from "./modalScreen";
import { useNavigation } from "@react-navigation/native";



export default function Settings ({route}){
    const {username, ChurchName} = route.params
    const navigation = useNavigation()
    const [isActive, setActive] = useState(true)
    const [isModal, setModal] = useState(false)


    

    return(
        <View style={{flex:1, justifyContent:"space-between"}}>


            <StatusBar barStyle={"dark-content"} backgroundColor={"white"}/>


            <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-between", marginBottom:5}}>
                    <View style={{height:80,width:"18%",justifyContent:"center",borderBottomRightRadius:50,padding:10,borderTopRightRadius:50, backgroundColor:"white",elevation:5}}>
                        {ChurchName?.Image ? 
                            <View style={{width:55,height:55,marginRight:10, alignItems:"center", justifyContent:"center"}}>
                                <Image source={{uri : ChurchName?.Image}} style={{width:55, height:55,borderRadius:50}}  />
                            </View> :
                            <View style={{paddingRight:3,alignItems:"center", justifyContent:"center"}}>
                                <Ionicons name="person-circle-sharp" size={55}  color={"gray"} />
                            </View>
                        }
                    </View>

                    <View style={{height:80, width:"80%", alignItems:"center", justifyContent:"center", elevation:6, borderBottomRightRadius:60, borderTopLeftRadius:50,borderBottomLeftRadius:50, backgroundColor:"white" }}>
                        <Text style={{fontSize:18,fontWeight:"800",color:"rgba(0, 0, 128, 0.8)",}} adjustsFontSizeToFit={true}>
                            {ChurchName?.ChurchName.toUpperCase()}
                        </Text>

                        <Text style={{fontSize:16,fontWeight:"400",color:"gray",marginTop:2}}>
                            {username}
                        </Text>
                    </View>
            </View>

            

            <View style={{padding:15}}>
                    <View style={{marginTop:20,alignItems:"center", flexDirection:"row", justifyContent:"space-around"}}>
                                <View style={{height:50,width:"18%",justifyContent:"center", borderTopLeftRadius:20,borderBottomRightRadius:50,padding:10, backgroundColor:"white",elevation:5}}>
                                    <Ionicons name="calculator-outline" color={"navy"} size={26}/>
                                </View>

                                <>
                                    <TouchableOpacity onPress={()=> {}} style={{height:50, width:"80%",paddingLeft:25, paddingRight:10, alignItems:"center",flexDirection:"row", justifyContent:"space-between", borderBottomRightRadius:20, borderBottomWidth:1, borderRightWidth:1,borderTopLeftRadius:20, borderColor:"white",elevation:2}}>
                                        <Text style={{fontSize:18,fontWeight:"400",color:"gray"}}>Statistics</Text>
                                        <MaterialIcons name="arrow-right" size={25} color="gray" />
                                    </TouchableOpacity>
                                </>
                    </View>
                <View >

                    <View style={{marginTop:20,alignItems:"center", flexDirection:"row", justifyContent:"space-around"}}>
                                <View style={{height:50,width:"18%",justifyContent:"center", borderTopLeftRadius:20,borderBottomRightRadius:50,padding:10, backgroundColor:"white",elevation:5}}>
                                    <Ionicons name="calculator-outline" color={"navy"} size={26}/>
                                </View>

                                <>
                                    <TouchableOpacity onPress={()=> {}} style={{height:50, width:"80%",paddingLeft:25, paddingRight:10, alignItems:"center",flexDirection:"row", justifyContent:"space-between", borderBottomRightRadius:50, borderTopRightRadius:50, borderTopLeftRadius:80,borderBottomLeftRadius:15, backgroundColor:"navy" }}>
                                        <Text style={{fontSize:18,fontWeight:"400",color:"white"}}>Statistics</Text>
                                        <MaterialIcons name="arrow-right" size={25} color="white" />
                                    </TouchableOpacity>
                                </>
                    </View>
                </View>
            </View>
                
                <View style={{flexDirection:"row", justifyContent:"space-around", alignItems:"center", height:55,borderTopWidth:1, borderColor:"lightgray", backgroundColor:"white"}}>
                <Pressable onPress={()=> navigation.navigate("ModalScreen", {username:username, ChurchName : ChurchName})}>
                    
                    <View style={{alignItems:"center"}}>
                        <MaterialIcons name="dashboard" size={23} color="gray" />
                         <Text style={{fontWeight:"500",fontSize:12, color:"gray"}}>
                             More
                         </Text>
                     </View>
                    
                </Pressable>

                <Pressable onPress={()=> navigation.replace("Church Admin")} >

                    <View style={{alignItems:"center",}}>
                         <Ionicons name="home-outline" size={24} color={"gray"}  />
                         <Text style={{color: "gray",fontWeight:"500", fontSize:12}}>
                             Home
                         </Text>
                     </View>
                   
                    
                </Pressable>

                <Pressable>
                    {({pressed})=>(
                    <View style={{alignItems:"center"}}>
                        <Ionicons name="settings-outline" size={24} color={pressed || isActive ? "navy" :"gray"}  />
                        <Text style={{color: pressed || isActive ? "navy": "gray",fontWeight:"500", fontSize:12}}>
                             Settings
                         </Text>
                     </View>
                    )
}
               
                </Pressable>
              
           </View>
           {isModal && <ModalScreen name = {username}/>}
        </View>
    )
}