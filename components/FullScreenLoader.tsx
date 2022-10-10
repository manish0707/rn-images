import React from 'react';
import {View, ActivityIndicator, StyleSheet, Text} from 'react-native';

export function FullScreenLoader() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.loadingText}>Loading Photos...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 5
  }
});
