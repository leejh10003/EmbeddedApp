import * as React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { Text, Divider, Layout, TopNavigation, Spinner } from '@ui-kitten/components';
import gql from 'graphql-tag';
import { useSubscription } from '@apollo/client';
import NotificationEntity, { EmptyIcon } from './notificationEntity';
import BackButton from '../components/backButton';

const GET_NOTIFICATION = gql`subscription GetNotification{
  notification(order_by: [{id: desc}]){
    kind
    content
    created_at
    view_name_arg
    id
    route_kind
    stock_id
    tray_id
    stock {
      id
      name
      weights(limit: 1, order_by: [{id: desc}]) {
        id
        value
        images(limit: 1, order_by: [{id: desc}]) {
          id
          url
        }
      }
    }
  }
}`

export default (props) => {
  const { data, loading, error } = useSubscription(GET_NOTIFICATION);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <TopNavigation title='알림' alignment='center' accessoryLeft={() => <BackButton {...props}/>}/>
      <Divider/>
      <ScrollView>
        <Layout style={{
          flex: 1,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 30
        }}>
          {!!!(error) ? (loading === false ? data.notification.length > 0 ? data.notification.map((item) => (<NotificationEntity key={item.id} item={item} {...props} />)) : (<EmptyIcon />) : <Layout style={{paddingTop: 10, alignItems: 'center'}}><Spinner/></Layout>) : <Text>{`${error}`}</Text>}
        </Layout>
      </ScrollView>
    </SafeAreaView>
  );
};