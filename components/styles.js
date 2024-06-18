import { StyleSheet } from "react-native";


const styles = StyleSheet.create({

    container:{
        flex:1,
        paddingHorizontal:20,
        paddingVertical:15,
        
        justifyContent:"space-between"
    },

    logoView:{
        backgroundColor:"rgba(0, 0, 128, 0.8)",
        padding:10,
        width: "100%",
        alignSelf:"flex-start",
        borderTopRightRadius:100,
        borderBottomRightRadius:100,
        borderBottomLeftRadius:90,
        
    },

    welcomeTxt:{
        color:"white",
        fontSize:25,
        fontWeight:"500",
        alignSelf:"center"
    },

    text:{
        fontSize:16, 
    },

    searchView:{
        justifyContent:"space-evenly",
        height:250,

    },

   

    socialView:{
       justifyContent:"space-around",
       alignItems:"center",
       width:"100%",
       height:150,
       marginTop:5,

    },

    options:{
        marginTop:10,
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"row"
    },
    Update:{
        fontSize:28,
        color:"rgba(0, 0, 128, 0.8)",
        fontWeight:"500",
        
    },

    updateTxt:{
        fontSize:16,
        fontWeight:"normal",
        textAlign:"justify",
        padding:3,
        marginTop:10,
    }
})



export default styles;