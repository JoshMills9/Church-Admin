import { StyleSheet } from "react-native";


const styles = StyleSheet.create({

    container:{
        flex:1,
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
        fontSize:18,
        color:"white",
        fontWeight:"500",
        
    },

    updateTxt:{
        fontSize:35,
        fontWeight:"700",
        marginRight:5,
        color:"white"
    }
})



export default styles;