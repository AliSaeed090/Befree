import {StyleSheet} from 'react-native';
import {BaseColor} from '../../config';


export default StyleSheet.create({
  leftbtn: {
    marginTop:30,
   width:48,
   height:48,
   backgroundColor:'#1E293B',
   borderRadius:10,
   justifyContent:'center',
   alignItems:'center',
    
  },
  righttbtn: {
    width:80,
    height:80,
    backgroundColor:'#1E293B',
    borderRadius:16,
    justifyContent:'center',
    alignItems:'center',
     
   },
  contentCenter: {
    width: '90%',
    height: 8,
    borderRadius:2,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    overflow  : 'hidden',
  },
  contain: {
    flex: 1,
  },
  row_center_95: {
    // position:"relative",
    // backgroundColor: BaseColor.fieldColor,
    width: '95%',
    // alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  ListView:{
   marginVertical: 6,
    borderColor: 'transparent',
    // borderWidth: 3,
    borderRadius: 14,
    // width:'50%',
  },
  ListViewText:{
    width: '100%',
    // flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
  
    // height: 50,
    borderRadius: 12,
    padding: 16,
  },
  logo: {
    marginTop:30,
    width: 64,
    height: 64,
    marginVertical: 16,
    borderRadius:10
  },
});
