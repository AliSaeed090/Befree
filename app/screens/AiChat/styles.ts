import React from "react";
import { StyleSheet } from "react-native";
import { BaseColor } from "../../config";
const THUMB_RADIUS = 12;
export default StyleSheet.create({
    leftbtn: {
        width:48,
        height:48,
         backgroundColor:'#1E293B',
         borderRadius:10,
         justifyContent:'center',
         alignItems:'center',
         
       },
       righttbtn: {
        width:48,
        height:48,
         backgroundColor:'#1E293B',
         borderRadius:10,
         justifyContent:'center',
         alignItems:'center',
          
        },
       contentCenter: {
         width: '100%',
         // height: 8,
         borderRadius:2,
         marginTop:-5,
         // backgroundColor: '#1E293B',
         justifyContent: 'center',
       },
    footerContainer: {
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10
    },
    footerText: {
        fontSize: 14,
        color: "#aaa"
    },
    styleThumb: {
        borderWidth: 1,
        borderColor: BaseColor.whiteColor,
      
        borderRadius:50,
        width:40,
        height:40
    },
    root: {
        width: 8,
        height: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#4499ff',
        borderLeftWidth: 4,
        borderRightWidth: 4,
        borderTopWidth: 8,
      },
      rootLabel: {
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#4499ff',
        borderRadius: 4,
      },
      text: {
        fontSize: 16,
        color: '#fff',
      },
      rootRail:{
        flex: 1,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#7f7f7f',
      },
      rootRailSelected:{
        height: 4,
        backgroundColor: '#4499ff',
        borderRadius: 2,
      },
      rootThumb:{
        width: THUMB_RADIUS * 2,
        height: THUMB_RADIUS * 2,
        borderRadius: THUMB_RADIUS,
        borderWidth: 2,
        borderColor: '#7f7f7f',
        backgroundColor: '#ffffff',
      }
});
