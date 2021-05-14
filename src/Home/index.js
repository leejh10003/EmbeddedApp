import * as React from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DetailsScreen from '../Details';
import { Button, Divider, Layout, TopNavigation } from '@ui-kitten/components';

function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: 'white' }} >
      <TopNavigation title="홈" alignment='center'/>
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

const HomeStack = createStackNavigator();

export default () => {
  return (
    <HomeStack.Navigator headerMode='none'>
      <HomeStack.Screen name="홈" component={HomeScreen} />
      <HomeStack.Screen name="상세" component={DetailsScreen} />
    </HomeStack.Navigator>
  );
} 