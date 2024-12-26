import React, { useState } from 'react'
import {FlatList, Image,useColorScheme, Text, TouchableOpacity, View, useWindowDimensions} from 'react-native'
import styles from './styles'
import { Ionicons } from '@expo/vector-icons';

import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import { Badge, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';


export const NotificationsScreen = ({route}) => {
    const navigation = useNavigation()
    const {username, ChurchName, events} = route.params
    const isDarkMode = useColorScheme() === 'dark';


    const WindowsWidth = useWindowDimensions().width
    const WindowHeight = useWindowDimensions().height
 
  return (
    <View  style={[styles.container,{backgroundColor: isDarkMode ? '#121212' : '#FFFFFF' ,justifyContent:"space-between",paddingHorizontal:20, paddingVertical:10}]}>
        <StatusBar style='auto' backgroundColor={isDarkMode ? '#121212' : '#FFFFFF'} />
        
        <View style={{flex:1, justifyContent:"space-between",marginTop:30}}>
            <View>
                <AntDesign name="leftcircleo" size={35}  onPress={()=> navigation.navigate("Settings", {username : username , ChurchName : ChurchName , events: events})} color={ isDarkMode ? '#FFFFFF' : '#000000' } />
            </View>

            <View style={{alignSelf:"center",alignItems:"center", marginVertical:20}}>
                <View  style={{position:"absolute", top:0,right:WindowHeight < 800 ? 90 :130, width:10, height:10, borderRadius:100, backgroundColor:"rgba(100, 200, 255, 1)"}} ></View>
                <Ionicons name="notifications-outline" size={70} color={ isDarkMode ? '#FFFFFF' : '#000000' } />
                <Text style={{fontSize: WindowHeight < 800 ? 38 : 50, color: isDarkMode ? '#FFFFFF' : '#000000'  , fontWeight:"600"}}>Notifications</Text>
                <Text style={{fontSize:14, color: isDarkMode ? '#FFFFFF' : '#000000' }}>{1} Account Connected</Text>
            </View>
            
        </View>


        <View style={{flex:2, paddingHorizontal:10, justifyContent:"center", marginVertical: WindowHeight < 800 ? 15 :20}}>

                <View style={{flex:1}}>
                    <Text  style={{fontSize:16, color: isDarkMode ? '#FFFFFF' : '#000000' , width:"90%", margin:10}}>General</Text>
                    <Badge size={15} style={{position:"absolute",zIndex:9,elevation:4, top:46, right:0}} />

                            <TouchableOpacity style={{backgroundColor: isDarkMode ? "rgba(50, 50, 50, 1)" : "#FFFFFF" , elevation:4,height: WindowHeight < 800 ? 85 : 90, borderRadius:20,padding: WindowHeight < 800 ? 10 : 15,marginVertical:5, justifyContent:"space-between", alignItems:"flex-start"}}>
                                <Text style={{fontSize:14, color: isDarkMode ? '#FFFFFF' : '#000000' }}>Church Admin</Text>
                                <View style={{flexDirection:"row", alignItems:"flex-start", width:"100%", justifyContent:"space-between"}}>
                                    <Text  style={{fontSize:16, color: isDarkMode ? '#FFFFFF' : '#000000' , width:"90%",paddingVertical:3}} numberOfLines={2}>Admin account created with email: {ChurchName?.email}.</Text>
                                    <MaterialIcons name="arrow-drop-down" size={30} color={ isDarkMode ? '#FFFFFF' : '#000000' } />
                                </View>
                            </TouchableOpacity>
                </View>

                
                {events &&
                    <View style={{flex:2}}>
                        <Text style={{fontSize:16, color: isDarkMode ? '#FFFFFF' : '#000000' , width:"90%", margin:10}}>Events</Text>
                        <FlatList
                        data={events?.sort((a, b) => b.createdAt - a.createdAt)}

                        keyExtractor={(item, index) => item?.EventName.toString()}

                        renderItem={({item})=>(
            
                        <TouchableOpacity style={{backgroundColor:isDarkMode ? "rgba(50, 50, 50, 1)" : "#FFFFFF",marginHorizontal:3,elevation:4,height: WindowHeight < 800 ? 85 : 90, borderRadius:20,padding: WindowHeight < 800 ? 10 : 15,flexDirection:"row",marginVertical:5, justifyContent:"space-between", alignItems:"center"}}>
                            <Image source={{uri: item.Image}}  resizeMode='cover' style={{backgroundColor:isDarkMode ? "white" : "black", padding:10, marginRight:10, borderRadius:10, width:60, height:60}}  />
                            <View style={{justifyContent:"space-evenly"}}>
                                <Text style={{fontSize:14, color: isDarkMode ? '#FFFFFF' : '#000000' ,paddingVertical:5}}>{item.StartDate}</Text>
                                <View style={{flexDirection:"row", alignItems:"center", width:"85%",paddingVertical:5, justifyContent:"space-between"}}>
                                    <View>
                                    <Text style={{fontSize:18, color: isDarkMode ? '#FFFFFF' : '#000000' , width:"100%"}} adjustsFontSizeToFit={item.About ? true : false} numberOfLines={item.About ? 1 : 2}>{item.EventName}</Text>
                                    {item.About && <Text style={{fontSize:12, color:isDarkMode ? '#FFFFFF' : '#000000' , width:"100%"}} adjustsFontSizeToFit={true} numberOfLines={1}>{item.About}</Text>}
                                    </View>
                                    <MaterialIcons name="arrow-drop-down" size={30} color={ isDarkMode ? '#FFFFFF' : '#000000' } />
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
