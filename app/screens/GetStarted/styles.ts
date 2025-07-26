import {StyleSheet} from 'react-native';
import {BaseColor} from '../../config';

export default StyleSheet.create({
  overlay: {
    position: 'absolute',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    width: '100%',
    height: '100%',
    flex: 1,
  },
  leftbtn: {
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
    width: '100%',
    height: 8,
    borderRadius:2,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
  },
  contain: {
    flex: 1,
  },
  row_center_95: {
    position:"relative",
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  logo: {
    // marginTop:30,
    width: 200,
    height: 100
  },
});
