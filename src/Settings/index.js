import * as React from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import DetailsScreen from '../Details';
import { Button, Divider, Layout, TopNavigation } from '@ui-kitten/components';


function SettingsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: 'white' }} >
      <TopNavigation title="설정" alignment='center'/>
      <Divider />
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>홈 화면</Text>
        <Button
          onPress={() => navigation.navigate('상세')}
        >
          상세 확인하기
        </Button>
      </Layout>
    </View>
  );
}
const SettingsStack = createStackNavigator();

export default () => {
  return (
    <SettingsStack.Navigator headerMode='none'>
      <SettingsStack.Screen name="설정" component={SettingsScreen} />
      <SettingsStack.Screen name="상세" component={DetailsScreen} />
    </SettingsStack.Navigator>
  );
}

