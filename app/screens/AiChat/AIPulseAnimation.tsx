import React, {useEffect, useRef} from 'react';
import {View, Text, Animated, StyleSheet, Image} from 'react-native';
import {Images} from '../../config'

const AIPulseAnimation = ({isListening = true, isSpeaking = false}) => {
  // Animation values for listening state
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const outerPulseAnim = useRef(new Animated.Value(1)).current;

  // Animation values for speaking bars
  const barAnimations = [
    useRef(new Animated.Value(0.3)).current,
    useRef(new Animated.Value(0.5)).current,
    useRef(new Animated.Value(0.7)).current,
    useRef(new Animated.Value(0.4)).current,
    useRef(new Animated.Value(0.6)).current,
  ];

  useEffect(() => {
    if (isListening) {
      // Listening animation - pulsing waves
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1.2,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(outerPulseAnim, {
              toValue: 1.8,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(outerPulseAnim, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ).start();
    } else {
      // Speaking animation - animated bars
      barAnimations.forEach((anim, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: Math.random() * 0.7 + 0.3, // Random height between 0.3 and 1
              duration: 700 + Math.random() * 300, // Random duration between 700-1000ms
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: Math.random() * 0.5 + 0.2, // Random height between 0.2 and 0.7
              duration: 700 + Math.random() * 300,
              useNativeDriver: true,
            }),
          ]),
        ).start();
      });
    }

    return () => {
      // Cleanup
      pulseAnim.stopAnimation();
      outerPulseAnim.stopAnimation();
      barAnimations.forEach(anim => anim.stopAnimation());
    };
  }, [isListening]);

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
  {/* <Image source={Images.BLogo}  resizeMode='contain' tintColor='red'  style={{height:30, width:30, }}/> */}

        {/* {isListening ===true && ( */}
        {isListening === true && (
          <>
            {/* Listening animation */}
            <Animated.View
              style={[
                styles.outerCircle,
                {
                  transform: [{scale: outerPulseAnim}],
                  opacity: outerPulseAnim.interpolate({
                    inputRange: [1, 1.8],
                    outputRange: [0.3, 0],
                  }),
                },
              ]}
            />
            <Animated.View
              style={[
                styles.mainCircle,
                {
                  transform: [{scale: pulseAnim}],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.innerHighlight,
                {
                  transform: [{scale: pulseAnim}],
                },
              ]}
            />
          </>
        )}
  {/* <Image source={Images.BLogo}  resizeMode='contain' style={{height:30, width:30,  }}/> */}
        {/* {(isListening ===false && isSpeaking===false) && ( */}
        {isListening === false && isSpeaking === false && (
          <>
            <Animated.View
              style={[
                styles.outerCircle,
                {
                  transform: [{scale: outerPulseAnim}],
                  opacity: outerPulseAnim.interpolate({
                    inputRange: [1, 1.8],
                    outputRange: [0.3, 0],
                  }),
                },
              ]}
            >
            {/* <Image source={Images.BLogo}  resizeMode='contain' style={{height:30, width:30,  }}/> */}
            </Animated.View>
            <Animated.View
              style={[
                styles.mainCircle,
                {
                  transform: [{scale: pulseAnim}],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.innerHighlight,
                {
                  transform: [{scale: pulseAnim}],
                },
              ]}
            />
          </>
        )}
        {/* {isSpeaking=== true &&( */}
        {isSpeaking === true && (
          // Speaking animation with bars
          <View style={styles.speakingContainer}>
            {barAnimations.map((anim, index) => {
              // Determine color based on index
              let backgroundColor;
              if (index % 3 === 0) {
                backgroundColor = 'white';
              } else if (index % 3 === 1) {
                backgroundColor = 'white';
              } else {
                backgroundColor = 'white';
              }

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.bar,
                    {
                      transform: [
                        {
                          scaleY: anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.3, 1],
                          }),
                        },
                      ],
                      backgroundColor,
                    },
                  ]}
                />
              );
            })}
          </View>
        )}
      </View>

      <Text style={styles.statusText}>
        {isListening === true && 'Listening...'}
        {isSpeaking === true && 'Speaking...'}
        {isListening === false && isSpeaking === false && 'Press microphone'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  animationContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3B82F6',
  },
  mainCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'transparent',
  },
  innerHighlight: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(235, 235, 65, 1)',
    top: 15,
    left: 15,
  },
  speakingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 60,
    padding: 20,
  },
  bar: {
    width: 8,
    height: 80,
    marginHorizontal: 2,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  statusText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4B5563',
  },
});

export default AIPulseAnimation;
