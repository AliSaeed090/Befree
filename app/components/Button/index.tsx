import Text from "../Text";
import { BaseColor, useTheme } from "../../config";
import PropTypes from "prop-types";
import React from "react";
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from "react-native";
import styles from "./styles";


export type props = {
  style?: object | Array<object>;
  styleText?: object | Array<object>;
  icon?:any;
  iconLeft?:any;
  iconRight?:any;
  outline?:boolean,
  full?:boolean,
  round?:boolean,
  loading?:boolean,
  children?:any,
  onPress?:any
};
export default function Button(props:props) {
  const { colors } = useTheme();
  const {
    style,
    styleText,
    icon,
    outline,
    full,
    round,
    loading,
    children,
    onPress,
    iconLeft,
    iconRight,
    ...rest
  } = props;

  return (
    <TouchableOpacity
      // {...rest}
      disabled={loading}
      onPress={onPress}
      style={StyleSheet.flatten([
        [styles.default, { backgroundColor: colors.primary }],
        outline && [
          styles.outline,
          {
            backgroundColor: colors.card,
            borderColor: colors.primary,
          },
        ],
        full && styles.full,
        round && styles.round,
        style,
      ])}
      activeOpacity={0.9}
    >
      {iconLeft && iconLeft}
      <Text
        style={StyleSheet.flatten([
          styles.textDefault,
          outline && { color: colors.primary },
          styleText,
        ])}
        numberOfLines={1} header={false} title1={false} title2={false} title3={false} headline={false} body1={false} body2={false} callout={false} subhead={false} footnote={false} caption1={false} caption2={false} overline={false} thin={false} ultraLight={false} light={false} regular={false} medium={false} semibold={false} bold={false} heavy={false} black={false} primaryColor={false} darkPrimaryColor={false} lightPrimaryColor={false} accentColor={false} grayColor={false} dividerColor={false} whiteColor={false} fieldColor={false} textAlign={""}      >
        {children || "Button"}
      </Text>
      {iconRight && iconRight}
      {loading ? (
        <ActivityIndicator
          size="small"
          color={outline ? colors.primary : BaseColor.whiteColor}
          style={{ paddingLeft: 5 }}
        />
      ) : null}
    </TouchableOpacity>
  );
}

Button.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  icon: PropTypes.node,
  outline: PropTypes.bool,
  full: PropTypes.bool,
  round: PropTypes.bool,
  loading: PropTypes.bool,
};

// Button.defaultProps = {
//   style: {},
//   icon: null,
//   outline: false,
//   full: false,
//   round: false,
//   loading: false,
// };
