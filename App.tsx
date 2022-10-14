import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ImageList from './screens/ImageList';
import ImageDetail from './screens/ImageDetail';

const Stack = createNativeStackNavigator();

// const options = {
//   headerBackTitleVisible: false,
//   cardStyleInterpolator: ({
//     current: {progress},
//   }: {
//     current: {progress: any};
//   }) => {
//     return {
//       cardStyle: {
//         opacity: progress,
//       },
//     };
//   },
// };

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="HomeScreen" component={ImageList} />
        <Stack.Screen
          name="DetailScreen"
          component={ImageDetail}
          options={{animation: 'none'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
