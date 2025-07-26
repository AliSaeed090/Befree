import React from 'react';
import {StyleSheet} from 'react-native';


export default StyleSheet.create({
  contain: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  
  row:{
    
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row2:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileItem: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 10,
    // paddingVertical: 20,
  },
  themeIcon: {
    width: 16,
    height: 16,
  },
  leftbtn: {
    marginTop:Platform.OS === 'android' ? 30 : 0,
    width:48,
    height:48,
    backgroundColor:'#1E293B',
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center',
     
   },
   logo: {
    width: 130,
    height: 130,
    borderRadius: 130,
  },
  rowIcon: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    marginTop: 0,
    backgroundColor: '#334155',
  },
});
