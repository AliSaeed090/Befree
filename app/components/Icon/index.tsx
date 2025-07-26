import PropTypes from "prop-types";
import React from "react";
import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import styles from "./styles";
export type props = {
  style?: object;
  enableRTL?: boolean;
  name:string,
  solid?: boolean;
  size?: number;
  color?: string;
};
export default function Index(props: props) {
  const { style, enableRTL,name, ...rest } = props;
  const layoutStyle = enableRTL ? styles.styleRTL : {};
  return <Icon name={name} style={StyleSheet.flatten([style, layoutStyle])} />;
}

Index.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  enableRTL: PropTypes.bool,
};

// Index.defaultProps = {
//   style: {},
//   enableRTL: false,
// };
