import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import DetailsScreen from '../Details';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>홈 화면</Text>
      <Button
        title="상세 확인하기"
        onPress={() => navigation.navigate('상세')}
      />
    </View>
  );
}

const HomeStack = createStackNavigator();

export default () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="홈" component={HomeScreen} />
      <HomeStack.Screen name="상세" component={DetailsScreen} />
    </HomeStack.Navigator>
  );
} 