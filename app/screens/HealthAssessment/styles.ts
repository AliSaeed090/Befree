import {StyleSheet} from 'react-native';
import {BaseColor} from '../../config';

export default StyleSheet.create({
  leftbtn: {
    // marginTop: 15,
    width: 48,
    height: 48,
    backgroundColor: '#1E293B',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  righttbtn: {
    width: 80,
    height: 80,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentCenter: {
    width: '100%',
    height: 8,
    borderRadius: 2,
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
  ListView: {
    marginVertical: 6,
    borderColor: 'transparent',
    borderWidth: 3,
    borderRadius: 14,
  },
  ListViewText: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    // height: 50,
    borderRadius: 12,
    padding: 16,
  },
  logo: {
    marginTop: 30,
    width: 64,
    height: 64,
  },
});
