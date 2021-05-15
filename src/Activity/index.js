import * as React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, Divider, Layout, Spinner, Icon} from '@ui-kitten/components';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import theme from '../../theme.json';
import NotificationScreen from './notification';
import NotificationEntity from './notificationEntity';
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    margin: 2,
  },
});

const GET_DOG_PHOTO = gql`query{
  notification(limit: 3, order_by: [{id: desc}]){
    id
    kind
    content
    created_at
  }
}`

function ActivityScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { loading, error, data, refetch } = useQuery(GET_DOG_PHOTO);
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }} >
      <Divider />
      <ScrollView>
        <Layout style={{
          flex: 1,
          paddingLeft: 20,
          paddingRight: 20
        }}>
          <Text
            category='h1'
            style={{
              marginTop: 40 + insets.top
            }}>알림</Text>
          <Text
            category='s2'
            style={{
              marginTop: 5,
              paddingBottom: 40
            }}
            >그동안 냉장고에서는 어떤 일이 있었을까요?</Text>
          {loading === false ? data.notification.map((item) => <NotificationEntity item={item}/>) : <Spinner/>}
          <Layout style={{
            alignItems: 'flex-end'
          }}>
            <Button onPress={() => navigation.navigate('알림')}style={{...styles.button, width: 'auto'}} appearance='ghost' status='primary' accessoryRight={() => <Icon style={{width: 16, height: 16}} fill={theme['color-primary-600']} name='arrow-circle-right-outline'/>}>
              알림 더 보기
            </Button>
          </Layout>
          <Layout style={{paddingBottom: 20}} />
          <Divider />
          <Text
            category='h1'
            style={{
              marginTop: 30
            }}>트레이</Text>
          <Text
            category='s2'
            style={{
              marginTop: 5,
              paddingBottom: 40
            }}
            >트레이의 현재상태를 볼까요?</Text>
          <Layout style={{paddingBottom: 30}} />
        </Layout>
      </ScrollView>
    </View>
  );
}

const HomeStack = createStackNavigator();

export default () => {
  return (
    <HomeStack.Navigator headerMode='none'>
      <HomeStack.Screen name="현재 활동" component={ActivityScreen} />
      <HomeStack.Screen name="알림" component={NotificationScreen} />
    </HomeStack.Navigator>
  );
} 