import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  FlatList,
  Text,
  View,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import {getPhotos, IPhoto} from '../api_client';
import CustomImage from '../components/CustomImage';
import {FullScreenLoader} from '../components/FullScreenLoader';

// TODO: Needs refectoring in the component

const ImageList = ({navigation}: {navigation: any}) => {
  const [photos, setPhotos] = useState<IPhoto[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

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
      <FlatList
        data={photos}
        ListEmptyComponent={<Text>No photos found!</Text>}
        keyExtractor={item => String(item.id)}
        numColumns={2}
        renderItem={({item: photo}) => {
          return (
            <CustomImage
              title={photo.title}
              source={{uri: photo.url}}
              onPress={(url: string, imageSpecs: any) => {
                navigation.navigate('DetailScreen', {uri: url, imageSpecs});
              }}
            />
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
    </View>
  );
};

export default ImageList;
