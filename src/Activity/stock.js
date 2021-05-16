import React from 'react';
import { SafeAreaView, ScrollView, Dimensions, View, Image } from 'react-native';
import { Divider, Icon, Layout, Text, TopNavigation, TopNavigationAction, Spinner, List, ListItem } from '@ui-kitten/components';
import { useSubscription } from '@apollo/client';
import gql from 'graphql-tag';
import LineGraphCard from '../components/lineGraphCard';
import NoDataCard from '../components/noDataCard';
import LineGraph from '../components/lineGraph';
import moment from 'moment';
const STOCK_SUBSCRIPTION = gql`subscription StockSubscription($id: Int!){
  tray(where: {id: {_eq: $id}}){
    name
    stocks(order_by: {id: desc}){
      name
      id
      weights(limit: 6, order_by: {id:desc}){
        value
        created_at
        images(limit: 1, order_by: {id: desc}){
          url
        }
      }
    }
  }
}`

const BackIcon = (props) => (
  <Icon {...props} name='arrow-back' />
);

const ListEntity = ({item, index}) => (<ListItem 
  accessoryLeft={() => (<Icon style={{width: 30, height: 30}} fill={item.delta === null || item.delta === 0 ? `grey` : (item.delta > 0 ? "#ff79b0" : "#40c4ff") } name={item.delta === null || item.delta === 0 ? `thermometer-outline` : (item.delta > 0 ? `thermometer-plus-outline` : `thermometer-minus-outline`)}/>)}
  title={`${item.temperature - 273}°C`}
  accessoryRight={() => <Layout style={{alignItems: 'center'}}>
    <Layout style={{flexDirection:'row', alignItems:'center'}}>{item.delta !== null && item.delta !== 0 ? <Icon style={{width: 10, height: 10}}  fill={item.delta > 0 ? `red` : `blue`} name={item.delta > 0 ? `arrow-up-outline` : `arrow-down-outline`}/> : null}<Text style={{color: item.delta != null && item.delta !== 0 ? (item.delta > 0 ? `red` : `blue`) : `grey`}}>{item.delta !== null ? `${Math.abs(item.delta)}` : `-`}</Text></Layout>
    <Text style={{fontSize: 10, color: 'grey'}}>{moment(item.created_at).local().format('HH:mm')}</Text>
  </Layout>}
/>)

export default ({navigation, route: {params: { id, name }}}) => {
  const { data, loading, error } = useSubscription(STOCK_SUBSCRIPTION, {
    variables: {id}
  });

  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack}/>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <TopNavigation title={`${name} 저장량`} alignment='center' accessoryLeft={BackAction}/>
      <Divider/>
        {
          loading === false ? (
          <Text>{JSON.stringify(data)}</Text>) : (<Spinner/>) 
        }
    </SafeAreaView>
  );
};