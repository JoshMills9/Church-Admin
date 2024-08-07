import { StyleSheet } from "react-native";


const styles = StyleSheet.create({

    container:{
        flex:1,
        backgroundColor:"rgba(30, 30, 30, 1)"
    },

    overlay:{
        flex:1,
        backgroundColor:"rgba(0, 0, 0, 0.3)",
        justifyContent:"flex-end"
    },

    logoView:{
        width: "100%",
        paddingHorizontal:20,
        justifyContent:"center"
    },

    main :{
        width:"100%",
        backgroundColor:"rgba(30, 30, 30, 1)",
        paddingHorizontal:15,
        paddingTop:15,
        borderTopRightRadius:50,
        borderTopLeftRadius:50,
    },
    welcomeTxt:{
        color:"white",
        fontSize:38,
        fontWeight:"500",
    },

    text:{
        fontSize:16, 
    },

    searchView:{
        justifyContent:"space-evenly",
        marginTop:8
    },

   

    socialView:{
       justifyContent:"space-around",
       alignItems:"center",
       width:"100%",
       height:100,
       marginTop:10,

    },

    options:{
        marginTop:10,
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"row"
    },
    Update:{
        fontSize:28,
        color:"rgba(100, 200, 255, 1)",
        fontWeight:"500",
        
    },

    updateTxt:{
        fontSize:16,
        fontWeight:"normal",
        textAlign:"justify",
        padding:3,
        marginTop:10,
        color:"rgba(240, 240, 240, 1)"
    }
})



export default styles;