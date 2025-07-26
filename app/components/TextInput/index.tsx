import {BaseColor, BaseStyle, useFont, useTheme} from '../../config';
import PropTypes from 'prop-types';
import React, {forwardRef, useState} from 'react';
import {I18nManager, TextInput, View} from 'react-native';
import {Text} from '../../components';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome';

export type props = {
  style?: any;
  onChangeText?: any;
  onFocus?: any;
  placeholder?: string;
  value?: string;
  success?: any;
  secureTextEntry?: any;
  keyboardType?: any;
  multiline?: any;
  textAlignVertical?: any;
  icon?: any;
  onSubmitEditing?: any;
  autoCorrect?: any;
  placeholderTextColor?: any;
  selectionColor?: any;
  // error?: boolean;
  errorMessage: string;
  editable?: boolean;
  label?: string;
  numberOfLines?: number;
  iconRight?: any;
  iconLeft?: any;
  marginTop?: number;
};

const Index = forwardRef((props: props, ref: any) => {
  const font = useFont();
  const {colors} = useTheme();
  const [isFocus, setIsFocus] = useState(false);

  const cardColor = colors.card;
  const {
    style,
    onChangeText,
    onFocus,
    placeholder,
    value,
    success,
    secureTextEntry,
    keyboardType,
    multiline,
    textAlignVertical,
    icon,
    onSubmitEditing,
    // error,
    errorMessage,
    editable,
    label,
    numberOfLines,
    iconRight,
    iconLeft,
    marginTop,
    ...attrs
  } = props;
  let error = errorMessage?.length > 0 ? true : false;
  return (
    <View style={{marginTop: marginTop ? marginTop : 0}}>
      {label && (
        <Text style={{marginBottom: 5, marginLeft: 3}} bold subhead>
          {label}
        </Text>
      )}
      <View
        style={[
          BaseStyle.textInput,
          {
            paddingHorizontal: 0,
            // backgroundColor: cardColor,
            // minHeight: 55,
            borderRadius: 14,
            padding: 0,
            borderColor: error
              ? '#4B2336'
              : isFocus
              ? '#0F2B5F'
              : 'transparent',
            borderWidth: 3,
          },

          // style,
        ]}>
        <View
          style={[
            BaseStyle.textInput,
            {
              backgroundColor: cardColor,
              borderColor: error
                ? '#F43F5E'
                : isFocus
                ? colors.primary
                : 'transparent',
              borderWidth: 1,
            },

            // style,
          ]}>
          {iconLeft && iconLeft()}
          <TextInput
            ref={ref}
            style={{
              fontFamily: `${font}-Regular`,
              flex: 1,
              height: '100%',
              textAlign: I18nManager.isRTL ? 'right' : 'auto',
              color: colors.text,
              // paddingTop: 5,
              // paddingBottom: 5,
            }}
            editable={editable}
            onChangeText={text => onChangeText(text)}
            onFocus={() => {
              onFocus();
              setIsFocus(true);
            }}
            onBlur={() => {
              setIsFocus(false);
            }}
            autoCorrect={false}
            placeholder={placeholder}
            placeholderTextColor={
              success ? BaseColor.grayColor : colors.primary
            }
            secureTextEntry={secureTextEntry}
            value={value}
            selectionColor={colors.primary}
            keyboardType={keyboardType}
            multiline={multiline}
            textAlignVertical={textAlignVertical}
            onSubmitEditing={onSubmitEditing}
            numberOfLines={numberOfLines}
            {...attrs}></TextInput>

          {iconRight && iconRight()}
        </View>
      </View>
      {errorMessage && (
        <View
          style={{
            minHeight: 44,
            borderRadius: 12,
            paddingHorizontal: 10,
            width: '100%',
            backgroundColor: '#881337',
            borderColor: '#F43F5E',
            borderWidth: 1,
            marginTop: 12,
            // justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <FontAwesome5Icon name="warning" size={20} color={'white'} />
          <Text callout bold style={{marginLeft: 10}}>
            Error: {errorMessage}
          </Text>
        </View>
      )}
    </View>
  );
});

export default Index;
