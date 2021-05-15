import * as React from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DetailsScreen from '../Details';
import { Text, Button, Divider, Layout, TopNavigation, Spinner, List, Card , Icon} from '@ui-kitten/components';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import theme from '../../theme.json';
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    margin: 2,
  },
});

const WarningIcon = (props) => (
  <Icon style={{width: 10}} {...props} name='alert-circle-outline'/>
);

const GET_DOG_PHOTO = gql`query{
  notification{
    id
    kind
    content
    created_at
  }
}`

const mapString = (kind) => {
  switch(kind){
    case 'primary': return {
      message: '주요',
      icon: 'alert-circle-outline',
      color: theme['color-primary-700']
    };
    case 'success': return {
      message: '성공',
      icon: 'checkmark-circle-outline',
      color: theme['color-success-700']
    };
    case 'info': return {
      message: '안내',
      icon: 'bulb-outline',
      color: theme['color-info-500']
    };
    case 'warning': return {
      message: '주의',
      icon: 'alert-triangle-outline',
      color: theme['color-warning-700']
    };
    case 'danger': return {
      message: '경고',
      icon: 'close-circle-outline',
      color: theme['color-danger-600']
    };
    case 'basic':
    default: return {
      message: '일반',
      icon: 'message-square-outline',
      color: 'black'
    };
  }
}

function ActivityScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { loading, error, data, refetch } = useQuery(GET_DOG_PHOTO);

  const renderItemHeader = (headerProps, item) => {
    const { message, icon, color } = mapString(item.kind);
    return(
      <View {...headerProps} style={[headerProps.style, {flexDirection:'row', alignItems:'center'}]}>
        <Icon style={{ width: 16, height: 16, marginRight: 10 }} fill={color} name={icon} />
        <Text style={{color}}>
          {message} 알림사항이 있습니다
        </Text>
      </View>)
};
  const renderItem = (item) => (
    <Card
      status={item.kind}
      header={headerProps => renderItemHeader(headerProps, item)}
      style={{
        marginBottom: 10
      }}
      >
        {/*footer={renderItemFooter} */}
      <Text>
        {item.content}
      </Text>
      <Text style={{
        textAlign: 'right',
        fontSize: 10,
        color: 'grey'
      }}>
        {item.created_at}
      </Text>
    </Card>
  );
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }} >
      {/*<TopNavigation title="현재 활동" alignment='center'/>*/}
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
          {loading === false ? data.notification.map((item) => renderItem(item)) : <Spinner/>}
          {/*<Button
            onPress={() => navigation.navigate('상세')}
          >
            상세 확인하기
          </Button>*/}
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
      <HomeStack.Screen name="상세" component={DetailsScreen} />
    </HomeStack.Navigator>
  );
} 