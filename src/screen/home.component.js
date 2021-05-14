import React from 'react';
import { SafeAreaView } from 'react-native';
import { Button, Divider, Layout, TopNavigation } from '@ui-kitten/components';

export const HomeScreen = ({ navigation }) => {
  
  const navigationDetails = () => {
    navigation.navigate('Details');
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation title='Embedded' alignment='center' />
      <Divider />
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button onPress={navigationDetails}>OPEN DETAILS</Button>
      </Layout>
    </SafeAreaView>
  )
}