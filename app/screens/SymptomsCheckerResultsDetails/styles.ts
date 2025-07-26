import {StyleSheet, Platform} from 'react-native';
import {BaseColor} from '../../config';

export default StyleSheet.create({
  leftbtn: {
    // Platform.OS === 'android' ? marginTop:30 : marginTop:0,
    marginTop: Platform.OS === 'android' ? 30 : 0,
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
    width: '90%',
    height: 8,
    overflow  : 'hidden',
    // alignSelf: 'center',
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
    width: '50%',
  },
  ListViewText: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
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
  container: {
    flex: 1,
    // backgroundColor: "#121212",
    // padding: 16,
  },
  header: {
    // alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
   
    color: "#FFFFFF",
    marginBottom: 8,
  },
  riskNumber: {
    fontSize: 48,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
  riskLevel: {
    fontSize: 20,
    color: "#FFFFFF",
    textAlign: "center",

    marginTop: 15,
  },
  description: {
    marginBottom: 20,
  },
  descriptionText: {
    color: "#CBD5E1",
    fontSize: 16,
    lineHeight: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 10,
    fontWeight: "bold",
  },
  listItem: {
    flexDirection: 'row',
    
    // color: "#CBD5E1",
    // justifyContent: "flex-start",
    // alignItems: 'flex-start',
    width: "96%",
    marginVertical: 4,
    lineHeight: 240,
    // textAlign: "justify",
    // backgroundColor : "#1E293B",
    fontSize: 16,
    marginBottom: 8,
  },
  tabContainer: {
    width: '90%',
    borderRadius:10,
    marginVertical: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    // paddingVertical: 16,
    padding:4,
    backgroundColor: '#1e293b',
  },
  tab: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#334155',
  },
  tabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
});
