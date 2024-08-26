import React, { useState } from 'react'
import {FlatList, Image, Text, TouchableOpacity, View, useWindowDimensions} from 'react-native'
import styles from './styles'
import { Ionicons } from '@expo/vector-icons';

import { AntDesign } from '@expo/vector-icons';
import { Zocial } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import { Badge, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { FontAwesome } from '@expo/vector-icons';

export const Notifications = ({route}) => {
    const navigation = useNavigation()
    const {username, ChurchName, events} = route.params

    console.log(events)
  

    const WindowsWidth = useWindowDimensions().width
    const WindowHeight = useWindowDimensions().height
 
  return (
    <View  style={[styles.container,{justifyContent:"space-between",paddingHorizontal:20, paddingVertical:10}]}>
        <View style={{flex:1, justifyContent:"space-between",marginTop:20}}>
            <View>
                <AntDesign name="leftcircleo" size={35}  onPress={()=> navigation.navigate("Settings", {username : username , ChurchName : ChurchName , events: events})} color="rgba(240, 240, 240, 1)" />
            </View>

            <View style={{alignSelf:"center",alignItems:"center", marginVertical:20}}>
                <View  style={{position:"absolute", top:0,right:WindowHeight < 800 ? 90 :130, width:10, height:10, borderRadius:100, backgroundColor:"rgba(100, 200, 255, 1)"}} ></View>
                <Ionicons name="notifications-outline" size={70} color="rgba(240, 240, 240, 1)" />
                <Text style={{fontSize: WindowHeight < 800 ? 38 : 50, color:"rgba(240, 240, 240, 1)" , fontWeight:"600"}}>Notifications</Text>
                <Text style={{fontSize:14, color:"rgba(240, 240, 240, 0.8)"}}>{1} Account Connected</Text>
            </View>
            
        </View>


        <View style={{flex:2, paddingHorizontal:10, justifyContent:"center", marginVertical: WindowHeight < 800 ? 15 :20}}>

                <View style={{flex:1}}>
                    <Text  style={{fontSize:16, color:"rgba(240, 240, 240, 0.8)", width:"90%", margin:10}}>General</Text>
                    <Badge size={15} style={{position:"absolute",zIndex:5, top:43, right:0}} />

                            <TouchableOpacity style={{backgroundColor:"rgba(50, 50, 50, 1)",height: WindowHeight < 800 ? 85 : 90, borderRadius:20,padding: WindowHeight < 800 ? 10 : 15,marginVertical:5, justifyContent:"space-between", alignItems:"flex-start"}}>
                                <Text style={{fontSize:14, color:"rgba(240, 240, 240, 0.7)"}}>Church Admin</Text>
                                <View style={{flexDirection:"row", alignItems:"flex-start", width:"100%", justifyContent:"space-between"}}>
                                    <Text  style={{fontSize:16, color:"rgba(240, 240, 240, 1)", width:"90%",paddingVertical:3}} numberOfLines={2}>Admin account created with email: {ChurchName?.email}.</Text>
                                    <MaterialIcons name="arrow-drop-down" size={30} color="rgba(240, 240, 240, 1)" />
                                </View>
                            </TouchableOpacity>
                </View>

                {/*users &&
                    <View style={{flex: !events ? 2 : 1}}>
                        <Text style={{fontSize:16, color:"rgba(240, 240, 240, 0.8)", width:"90%", margin:10}}>Accounts</Text>
                        <FlatList
                        data={users?.sort((a, b) => b.createdAt - a.createdAt)}

                        keyExtractor={(item, index) => item?.email.toString()}

                        renderItem={({item})=>(
            
                                <TouchableOpacity style={{backgroundColor:"rgba(50, 50, 50, 1)",height: WindowHeight < 800 ? 85 : 90, borderRadius:20,padding: WindowHeight < 800 ? 10 : 15,marginVertical:5, justifyContent:"space-between", alignItems:"flex-start"}}>
                                    <Text style={{fontSize:14, color:"rgba(240, 240, 240, 0.7)"}}>{item?.createdAt}</Text>
                                    <View style={{flexDirection:"row", alignItems:"flex-start", width:"100%", justifyContent:"space-between"}}>
                                        <Text style={{fontSize:16, color:"rgba(240, 240, 240, 1)", width:"90%",paddingVertical:3}} numberOfLines={2}>User account with email: {item?.email} created for {item?.Role}.</Text>
                                        <MaterialIcons name="arrow-drop-down" size={30} color="rgba(240, 240, 240, 1)" />
                                    </View>
                                </TouchableOpacity>
                    
                        )}

                        />
                    </View>
                        */}
                
                {events &&
                    <View style={{flex:2}}>
                        <Text style={{fontSize:16, color:"rgba(240, 240, 240, 0.8)", width:"90%", margin:10}}>Events</Text>
                        <FlatList
                        data={events?.sort((a, b) => b.createdAt - a.createdAt)}

                        keyExtractor={(item, index) => item?.EventName.toString()}

                        renderItem={({item})=>(
            
                        <TouchableOpacity style={{backgroundColor:"rgba(50, 50, 50, 1)",height: WindowHeight < 800 ? 85 : 90, borderRadius:20,padding: WindowHeight < 800 ? 10 : 15,flexDirection:"row",marginVertical:5, justifyContent:"space-between", alignItems:"center"}}>
                            <Image source={{uri: item.Image}}  resizeMode='cover' style={{backgroundColor:"white", padding:10, marginRight:10, borderRadius:10, width:60, height:60}}  />
                            <View style={{justifyContent:"space-evenly"}}>
                                <Text style={{fontSize:14, color:"rgba(240, 240, 240, 0.7)",paddingVertical:5}}>{item.StartDate}</Text>
                                <View style={{flexDirection:"row", alignItems:"center", width:"88%",paddingVertical:5, justifyContent:"space-between"}}>
                                    <View>
                                    <Text style={{fontSize:18, color:"rgba(240, 240, 240, 1)", width:"100%"}} adjustsFontSizeToFit={item.About ? true : false} numberOfLines={item.About ? 1 : 2}>{item.EventName}</Text>
                                    {item.About && <Text style={{fontSize:12, color:"rgba(240, 240, 240, 1)", width:"100%"}} adjustsFontSizeToFit={true} numberOfLines={1}>{item.About}</Text>}
                                    </View>
                                    <MaterialIcons name="arrow-drop-down" size={30} color="rgba(240, 240, 240, 1)" />
                                </View>
                            </View>
                        </TouchableOpacity>
                    
                        )}

                        />
                    </View>
                }
        
        </View>

    </View>
  )
}
