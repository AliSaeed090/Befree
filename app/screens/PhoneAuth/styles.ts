import React from "react";
import { StyleSheet } from "react-native";
import { useTheme,BaseColor } from "../../config";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BaseColor.fieldColor,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 20,
    height: 50,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7CDB8A',
    shadowColor: 'rgba(0,0,0,0.4)',
    shadowOffset: {
      width: 1,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  redColor: {
    backgroundColor: '#F57777'
  },
  message: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  contain: {
    width: "90%",
    alignSelf: 'center',
    paddingTop: 50,
    flex: 1,
    // justifyContent: "center",
    alignItems: 'center'
  },
  logo: {
marginTop: 100,
    width: 200,
    height: 100
  },
  root: {flex: 1, padding: 0},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: 0},
  cell: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: 8,
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: BaseColor.grayColor,
    textAlign: 'center',
    color:'white'
  },
  focusCell: {
    borderColor: '#000',
  },
});
