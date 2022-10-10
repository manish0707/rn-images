import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import {getPhotos, IPhoto} from './api_client';
import {FullScreenLoader} from './components';
import FullImage from './components/FullImage';

// TODO: Needs refectoring in the component

const App = () => {
  const [photos, setPhotos] = useState<IPhoto[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [selectedImage, setSelectedImage] = useState<{
    id: number | null;
    url: string | null;
  }>({id: null, url: null});

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const fetchPhotos = useCallback(async () => {
    try {
      if (currentPage > 0) {
        setIsFetchingMore(true);
      }
      const res = await getPhotos({page: currentPage});

      setPhotos(prev => [...prev, ...res]);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
    if (currentPage > 0) {
      setIsFetchingMore(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const screenWidth = Dimensions.get('window').width;

  const numberOfColumns = 2;

  const imageSize = screenWidth / numberOfColumns;

  const AnimatedImge = Animated.createAnimatedComponent(Image);

  const handleBackButton = () => {
    Alert.alert(
      'Exiting Application',
      'Are you sure about this action?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: () => BackHandler.exitApp(),
        },
      ],
      {
        cancelable: false,
      },
    );
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
  }, []);

  if (isLoading) {
    return (
      <View style={{flex: 1}}>
        <FullScreenLoader />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <>
        {selectedImage.id && selectedImage.url ? (
          <FullImage
            url={selectedImage.url}
            onBackPress={() => setSelectedImage({id: null, url: null})}
            size={imageSize}
          />
        ) : (
          <FlatList
            data={photos}
            ListEmptyComponent={<Text>No photos found!</Text>}
            keyExtractor={item => String(item.id)}
            numColumns={numberOfColumns}
            renderItem={({item: photo}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedImage({id: photo.id, url: photo.url});
                  }}
                  style={{
                    width: imageSize - 10,
                    margin: 5,
                  }}>
                  <AnimatedImge
                    source={{
                      uri: photo.thumbnailUrl,
                    }}
                    resizeMode="contain"
                    style={{
                      height: imageSize - 10,
                      width: imageSize - 10,
                    }}
                  />
                  {!selectedImage.id && <Text>{photo.title}</Text>}
                </TouchableOpacity>
              );
            }}
            onEndReachedThreshold={0.2}
            onEndReached={e => {
              setCurrentPage(curPage => curPage + 1);
            }}
            ListFooterComponent={
              <>{isFetchingMore ? <ActivityIndicator /> : <></>}</>
            }
          />
        )}
      </>
    </View>
  );
};

export default App;
