import {StyleSheet} from 'react-native';
import {BaseColor} from '../../config';


export default StyleSheet.create({
  header: {
    fontSize: 18,
    marginBottom: 16,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  calendar: {
    // marginHorizontal: 16,
    // borderRadius: 8,
    // overflow: 'hidden',
    // width: '100%',
    // backgroundColor: 'transparent',
    // elevation: 2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContainer: {
    
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  slotItem: {
    backgroundColor: '#e6f7ff',
    padding: 12,
    marginVertical: 4,
    borderRadius: 6,
  },
  slotText: {
    fontSize: 16,
    color: '#fff',
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
    // position:"relative",
    // backgroundColor: BaseColor.fieldColor,
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  ListView:{
   marginVertical: 6,
    borderColor: 'transparent',
    borderWidth: 3,
    borderRadius: 14,
    width:'50%',
  },
  ListViewText:{
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  
    // height: 50,
    borderRadius: 12,
    padding: 16,
  },
  logo: {
    marginTop:30,
    width: 64,
    height: 64
  },
});
