import React, { useRef, useState } from 'react';
import  { Paystack , paystackProps}  from 'react-native-paystack-webview';
import { View, TouchableOpacity,Text ,useColorScheme} from 'react-native';
import { BottomSheet } from 'react-native-btr';




export default function PayStack({pay}){
  const paystackWebViewRef = useRef(paystackProps.PayStackRef); 
  const isDarkMode = useColorScheme() === 'dark';

  const [isBottomSheetVisible, setBottomSheetVisible] = useState(pay);

  const toggleBottomSheet = () => {
    setBottomSheetVisible(!pay);
  };


 
  return (
    <BottomSheet visible={isBottomSheetVisible} onBackButtonPress={toggleBottomSheet}  onBackdropPress={toggleBottomSheet} >
      <View style={{height:200,alignItems:"center",borderTopRightRadius:50,borderTopLeftRadius:50,borderTopWidth:0.5,borderColor:"gray",padding:10,justifyContent:"center", backgroundColor:isDarkMode ? '#121212' : '#FFFFFF'}}>
            
            <View style={{position:"absolute", top:20}}>
                <Text style={{fontSize:18,fontWeight:"500", color:" rgba(100, 200, 255, 1)"}}>Church Administrator</Text>
            </View>

            <Paystack
                paystackKey="pk_test_0d8cf25b58b9f091dea8e262fc221ad66acea268"
                paystackSecretKey='sk_test_82a1acc2a1053e6b87dd02ace946446482bc5e03'
                billingName='Church Administrator'
                billingEmail="churchad9@gmail.com"
                phone={'0241380745'}
                currency='GHS'
                amount={2500}
                onCancel={(e) => {
                console.log(e)
                }}
                onSuccess={(res) => {
                console.log(res)
                }}
                ref={paystackWebViewRef}
            />

            <TouchableOpacity style={{borderColor:" rgba(100, 200, 255, 1)", borderWidth:2, padding:10, borderRadius:10, width:'50%', alignItems:"center"}} onPress={()=> paystackWebViewRef.current.startTransaction()}>
                <Text style={{color:isDarkMode ? '#FFFFFF' : '#000000'}}>Pay Now</Text>
            </TouchableOpacity>
        </View>
      </BottomSheet>
  );
}