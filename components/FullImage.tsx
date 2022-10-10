import React, {useMemo, useState} from 'react';
import {Animated, Button, Image, View} from 'react-native';
import DoubleTap from './DoubleTap';

export default function FullImage({
  url,
  onBackPress,
  size,
}: {
  url: string;
  onBackPress: () => void;
  size: number;
}) {
  const [liked, setLiked] = useState(false);

  const AnimatedImge = Animated.createAnimatedComponent(Image);

  const animationValue = useMemo(() => new Animated.Value(1), []);

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
          top: 250,
          bottom: 0,
        }}>
        <Animated.Image
          source={require('../images/heart.png')}
          style={imageStyles}
        />
      </View>
    );
  };

  const toggleLike = () => {
    console.log('tollgle');

    setLiked(prev => {
      const newLiked = !prev;

      if (newLiked) {
        Animated.sequence([
          Animated.spring(animationValue, {toValue: 1, useNativeDriver: true}),
          Animated.spring(animationValue, {toValue: 0, useNativeDriver: true}),
        ]).start();
      }

      return newLiked;
    });
  };

  console.log({liked});

  return (
    <View style={{flex: 1}}>
      <DoubleTap onDoubleTap={() => toggleLike()}>
        <View>
          <Button onPress={onBackPress} title="Back" />
          <AnimatedImge
            source={{
              uri: url,
            }}
            resizeMode="contain"
            style={{
              position: 'absolute',
              top: 200,
              left: 130,
              right: 0,
              height: 100,
              width: size - 10,
              transform: [
                {
                  scale: 4.5,
                },
              ],
            }}
          />
          {liked ? renderOverlay() : null}
        </View>
      </DoubleTap>
    </View>
  );
}
