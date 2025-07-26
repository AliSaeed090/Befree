import Text from '../../Text';
import PropTypes from 'prop-types';
import React, {useEffect, FC} from 'react';
import {StatusBar, TouchableOpacity, View, useColorScheme} from 'react-native';
// import {useDarkMode} from 'react-native-dynamic';
import {useSelector} from 'react-redux';
import styles from './styles';

export type props = {
  style?: object | Array<object>;
  styleLeft?: object | Array<object>;
  styleContentLeft?: object | Array<object>;
  styleContentCenter?: object | Array<object>;
  styleRight?: object | Array<object>;
  styleRightSecond?: object | Array<object>;
  styleContentRight?: object | Array<object>;
  title?: string;
  subTitle?: string;
  onPressLeft?: any;
  onPressRight?: any;
  onPressRightSecond?: any;
  renderLeft?: any;
  renderRightSecond?: any;
  renderRight?: any;
  renderCenterConetent?: any;
  barStyle?: object | Array<object>;
};

export default function Header(props: props) {
  const forceDark = useSelector((state: any) => state.application.force_dark);
  const {
    style,
    styleLeft,
    styleContentLeft,
    styleContentCenter,
    styleRight,
    styleRightSecond,
    styleContentRight,
    title,
    subTitle,
    onPressLeft,
    onPressRight,
    onPressRightSecond,
    renderLeft,
    renderRightSecond,
    renderRight,
    barStyle,
    renderCenterConetent
  } = props;
  // const isDarkMode = useDarkMode();
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    let option: any = true ? 'light-content' : 'light-content';
    if (forceDark) {
      option = 'light-content';
    }
    if (forceDark == false) {
      option = 'light-content';
    }
    if (barStyle) {
      option = barStyle;
    }
    StatusBar.setBarStyle(option, true);
  }, [forceDark, isDarkMode]);

  return (
    <View style={[styles.contain, style]}>
      <View style={[{flex: 1}, styleLeft]}>
        <TouchableOpacity
          style={[styles.contentLeft, styleContentLeft]}
          onPress={onPressLeft}>
          {renderLeft&&renderLeft()}
        </TouchableOpacity>
      </View>
      <View style={[styles.contentCenter, styleContentCenter]}>
        <Text headline numberOfLines={1} bold={false} thin={false} light={false} medium={false} regular={false} semibold={false} heavy={false} black={false} header={false} title1={false} title2={false} title3={false} body1={false} body2={false} callout={false} subhead={false} footnote={false} caption1={false} caption2={false} overline={false} ultraLight={false} primaryColor={false} darkPrimaryColor={false} lightPrimaryColor={false} accentColor={false} grayColor={false} dividerColor={false} whiteColor={false} fieldColor={false} textAlign={''}>
          {title}
        </Text>
{renderCenterConetent&&renderCenterConetent()}
        {subTitle != '' && (
          <Text caption2 light bold={false} thin={false} medium={false} regular={false} semibold={false} heavy={false} black={false} header={false} title1={false} title2={false} title3={false} headline={false} body1={false} body2={false} callout={false} subhead={false} footnote={false} caption1={false} overline={false} ultraLight={false} primaryColor={false} darkPrimaryColor={false} lightPrimaryColor={false} accentColor={false} grayColor={false} dividerColor={false} whiteColor={false} fieldColor={false} numberOfLines={0} textAlign={''}>
            {subTitle}
          </Text>
        )}
      </View>
      <View style={[styles.right, styleRight]}>
        <TouchableOpacity
          style={[styles.contentRightSecond, styleRightSecond]}
          onPress={onPressRightSecond}>
          {renderRightSecond&&renderRightSecond()}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.contentRight, styleContentRight]}
          onPress={onPressRight}>
          {renderRight&&renderRight()}
        </TouchableOpacity>
      </View>
    </View>
  );
}

Header.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleLeft: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleContentLeft: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleCenter: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleContentCenter: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleRight: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleRightSecond: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleContentRight: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  renderLeft: PropTypes.func,
  renderRight: PropTypes.func,
  renderRightSecond: PropTypes.func,
  onPressRightSecond: PropTypes.func,
  onPressLeft: PropTypes.func,
  onPressRight: PropTypes.func,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  barStyle: PropTypes.string,
};

// Header.defaultProps = {
//   style: {},
//   styleLeft: {},
//   styleContentLeft: {},
//   styleCenter: {},
//   styleContentCenter: {},
//   styleRight: {},
//   styleRightSecond: {},
//   styleContentRight: {},
//   renderLeft: () => {},
//   renderRight: () => {},
//   renderRightSecond: () => {},
//   onPressLeft: () => {},
//   onPressRight: () => {},
//   onPressRightSecond: () => {},
//   title: 'Title',
//   subTitle: '',
//   barStyle: '',
// };
