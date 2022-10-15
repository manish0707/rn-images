import React, {useEffect} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated as NativeAnimated,
} from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import DoubleTap from '../components/DoubleTap';

const {width} = Dimensions.get('window');

export default function ImageDetail({route, navigation}: any) {
  const {uri, imageSpecs} = route.params;

  const anim = useSharedValue(0);

  useEffect(() => {
    anim.value = 0;
    anim.value = withTiming(1, {duration: 300});
  }, []);

  const onClosePress = () => {
    const callback = () => navigation.goBack();
    anim.value = withTiming(
      0,
      {},
      isFinished => isFinished && runOnJS(callback)(),
    );
  };

  const imageContainerStyle = useAnimatedStyle(
    () => ({
      position: 'absolute',
      top: interpolate(anim.value, [0, 1], [imageSpecs.pageY, 0]),
      left: interpolate(anim.value, [0, 1], [imageSpecs.pageX, 0]),
      width: interpolate(anim.value, [0, 1], [imageSpecs.width, width]),
      height: interpolate(anim.value, [0, 1], [imageSpecs.height, 450]),
      borderRadius:
        interpolate(anim.value, [0, 1], [imageSpecs.borderRadius, 0]) || 0,
      overflow: 'hidden',
    }),
    [],
  );

  const bottomContainerStyle = useAnimatedStyle(
    () => ({
      opacity: anim.value,
    }),
    [],
  );

  const animationValue = React.useMemo(() => new NativeAnimated.Value(1), []);

  const [liked, setLiked] = React.useState(false);

  const renderOverlay = () => {
    const imageStyles = [
      {
        tintColor: '#fff',
      },
      {
        opacity: animationValue,
        transform: [
          {
            scale: animationValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.7, 1.5],
            }),
          },
        ],
      },
    ];

    return (
      <View
        style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          left: 20,
          right: 0,
          top: 0,
          bottom: 250,
        }}>
        <NativeAnimated.Image
          source={require('../images/heart.png')}
          style={imageStyles}
        />
      </View>
    );
  };

  const toggleLike = () => {
    
    setLiked(prev => {
      const newLiked = !prev;

      if (newLiked) {
        NativeAnimated.sequence([
          NativeAnimated.spring(animationValue, {
            toValue: 1,
            useNativeDriver: true,
          }),
          NativeAnimated.spring(animationValue, {
            toValue: 0,
            useNativeDriver: true,
          }),
        ]).start();
      }

      return newLiked;
    });
  };

  return (
    <DoubleTap onDoubleTap={() => toggleLike()}>
      <View style={styles.container}>
        <Animated.View style={imageContainerStyle}>
          <Image style={styles.image} source={{uri}} />
        </Animated.View>
        <Animated.View style={[styles.bottomContainer, bottomContainerStyle]}>
          <TouchableOpacity onPress={onClosePress} style={styles.btnClose}>
            <Text style={styles.text}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
        {liked ? renderOverlay() : null}
      </View>
    </DoubleTap>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  btnClose: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(44, 62, 80,1.0)',
    borderRadius: 50,
    margin: 5,
  },
  text: {
    color: '#fff',
  },
  bottomContainer: {
    position: 'absolute',
    right: 0,
  },
});
