import PropTypes from "prop-types";
import React from "react";
import { View, Platform, StyleSheet, TextInput, LayoutAnimation, UIManager } from "react-native";
import { MIN_COMPOSER_HEIGHT, DEFAULT_PLACEHOLDER } from "react-native-gifted-chat/lib/Constant";
import Color from "react-native-gifted-chat/lib/Color";
const styles = StyleSheet.create({
  textInput: {
    flex: undefined,
    lineHeight: 22,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    borderRadius: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
    borderColor: "transparent",
    paddingRight: 0,
    margin: 0,
    marginLeft: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    minHeight: 55,
    height: 106,
    maxHeight: 106,
    textAlignVertical: "top",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    fontSize: 16,
  },
});
const CustomLayoutSpring = {
  duration: 200,
  create: {
    type: LayoutAnimation.Types.easeOut,
    property: LayoutAnimation.Properties.opacity,
    springDamping: 0.7,
  },
  update: {
    type: LayoutAnimation.Types.easeOut,
    springDamping: 0.7,
  },
  delete: {
    type: LayoutAnimation.Types.easeOut,
    property: LayoutAnimation.Properties.opacity,
    springDamping: 0.7,
  },
};
export default class Composer extends React.PureComponent {
  state = {
    finalInputHeight: 0,
  };

  inputRef = React.createRef();

  constructor() {
    super(...arguments);
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    this.contentSize = undefined;
    this.onContentSizeChange = (e) => {
      const { contentSize } = e.nativeEvent;
      // Support earlier versions of React Native on Android.
      if (!contentSize) {
        return;
      }
      if (
        !this.contentSize ||
        (this.contentSize && this.contentSize.height !== contentSize.height)
      ) {
        this.contentSize = contentSize;
        if (!this.props.text.length) {
          LayoutAnimation.configureNext(CustomLayoutSpring);
          this.setState({ finalInputHeight: 0 });
          this.props.onInputSizeChanged({ width: 0, height: 0 });
        } else {
          this.calcInputHeight();
          this.props.onInputSizeChanged(this.contentSize);
        }
      }
    };
    this.onChangeText = (text) => {
      if (text.length < 2) {
        LayoutAnimation.configureNext(CustomLayoutSpring);
      }
      this.props.onTextChanged(text);
    };
    this.calcInputHeight = () => {
      if (this.contentSize && this.contentSize.height) {
        if (!this.props.text.length && this.state?.finalInputHeight > 0) {
          LayoutAnimation.configureNext(CustomLayoutSpring);
          this.setState({
            finalInputHeight: 0,
          });
          return;
        }
        let height = this.contentSize.height;
        LayoutAnimation.configureNext(CustomLayoutSpring);
        this.setState({
          finalInputHeight: height + 14,
        });
      }
    };
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          position: "relative",
          justifyContent: "flex-start",
          borderRadius: 20,
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
          marginLeft: 10,
          marginRight: 10,
          paddingTop: 6,
          paddingBottom: 0,
          paddingLeft: 12,
          paddingRight: 12,
          borderWidth: 0.5,
          borderColor: "#b7cc23",
          marginTop: this.state.finalInputHeight > 44 ? 3 : 6,
          minHeight: 38,
          maxHeight: 118,
          height: this.state.finalInputHeight,
        }}
      >
        <TextInput
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
          testID={this.props.placeholder}
          accessible
          accessibilityLabel={this.props.placeholder}
          placeholder={this.props.placeholder}
          placeholderTextColor={this.props.placeholderTextColor}
          multiline={this.props.multiline}
          editable={!this.props.disableComposer}
          onContentSizeChange={this.onContentSizeChange}
          onChangeText={this.onChangeText}
          textBreakStrategy="highQuality"
          style={styles.textInput}
          autoFocus={this.props.textInputAutoFocus}
          value={this.props.text}
          autoCompleteType="off"
          enablesReturnKeyAutomatically
          underlineColorAndroid="transparent"
          keyboardAppearance={this.props.keyboardAppearance}
          {...this.props.textInputProps}
          ref={this.inputRef}
        />
      </View>
    );
  }
}
Composer.defaultProps = {
  composerHeight: MIN_COMPOSER_HEIGHT,
  text: "",
  placeholderTextColor: Color.defaultColor,
  placeholder: DEFAULT_PLACEHOLDER,
  textInputProps: null,
  multiline: true,
  disableComposer: false,
  textInputStyle: {},
  textInputAutoFocus: false,
  keyboardAppearance: "default",
  onTextChanged: () => {},
  onInputSizeChanged: () => {},
};
Composer.propTypes = {
  composerHeight: PropTypes.number,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  textInputProps: PropTypes.object,
  onTextChanged: PropTypes.func,
  onInputSizeChanged: PropTypes.func,
  multiline: PropTypes.bool,
  disableComposer: PropTypes.bool,
  textInputStyle: PropTypes.any,
  textInputAutoFocus: PropTypes.bool,
  keyboardAppearance: PropTypes.string,
};