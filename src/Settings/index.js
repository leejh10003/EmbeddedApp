import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import DetailsScreen from '../Details';


function SettingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>설정 화면</Text>
      <Button
        title="상세 확인하기"
        onPress={() => navigation.navigate('상세')}
      />
    </View>
  );
}
const SettingsStack = createStackNavigator();

export default () => {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="설정" component={SettingsScreen} />
      <SettingsStack.Screen name="상세" component={DetailsScreen} />
    </SettingsStack.Navigator>
  );
}

