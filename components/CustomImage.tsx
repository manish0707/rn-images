import React from 'react';
import {Pressable, Image, Dimensions} from 'react-native';

export default function CustomImage({
  source,
  onPress,
}: {
  source: any;
  onPress: any;
}) {
  const imageRef = React.useRef();

  const screenWidth = Dimensions.get('window').width;

  const numberOfColumns = 2;

  const imageSize = screenWidth / numberOfColumns;

  const onImagePress = () => {
    imageRef.current?.measure?.((x, y, width, height, pageX, pageY) => {
      onPress && onPress(source.uri, {width, height, pageX, pageY});
    });
  };

  return (
    <Pressable onPress={onImagePress}>
      <Image
        ref={imageRef}
        source={{uri: source.uri}}
        style={{height: imageSize, width: imageSize}}
      />
    </Pressable>
  );
}
