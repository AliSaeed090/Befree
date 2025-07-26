import {StyleSheet, Dimensions,Platform} from 'react-native';
import {BaseColor} from '../../config';

export default StyleSheet.create({
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    // marginTop: 10,
    padding: 10,
    width: '100%',
  },
  contain: {
    paddingHorizontal: 10,
    // marginTop: 20,
    // flex: 1,
     
  },
  contentActionBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 100,
  },
  leftbtn: {
    marginTop:Platform.OS === 'android' ? 30 : 30,
    width:48,
    height:48,
    backgroundColor:'#1E293B',
    borderRadius:10,
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
  pdf: {
    flex: 1,
    // width:Dimensions.get('window').width,
    // height:Dimensions.get('window').height,
  },
});
