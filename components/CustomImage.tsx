import React from 'react';
import {Pressable, Image, Dimensions, Text} from 'react-native';

export default function CustomImage({
  source,
  onPress,
  title,
}: {
  source: any;
  onPress: any;
  title: string;
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
      <Text style={{width: imageSize, marginBottom: 20, marginTop: 5}}>{title}</Text>
    </Pressable>
  );
}
