import {StyleSheet} from 'react-native';
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
    // flex: 1,
    justifyContent: 'center',
  },
  contentActionBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop:16
  },
  logo: {
    width: 56,
    height: 56,
    
  },
});
