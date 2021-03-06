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
        id
        value
        created_at
        images(order_by: {id: asc}){
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
  accessoryLeft={() => (<Icon pack='material' style={{width: 30, height: 30, color: item.delta === null || item.delta === 0 ? `grey` : (item.delta > 0 ? "#ff79b0" : "#40c4ff")}} color={item.delta === null || item.delta === 0 ? `grey` : ("#40c4ff") } name={item.delta === null || item.delta === 0 ? 'shopping-cart' : (item.delta > 0 ? `add-shopping-cart` : `remove-shopping-cart`)}/>)}
  title={`${item.value}g`}
  accessoryRight={() => <Layout style={{flowDirection:'row'}}>
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
      <TopNavigation title={`${name} ?????????`} alignment='center' accessoryLeft={BackAction}/>
      <Divider/>
      {
          loading === false ? (
          <List
            ItemSeparatorComponent={Divider}
            ListHeaderComponent={<LineGraph
              data={{
                labels: data?.tray?.[0]?.stocks?.[0]?.weights?.slice(Math.max(0, data?.tray?.[0]?.stocks?.[0]?.weights?.length - 6), data?.tray?.[0]?.stocks?.[0]?.weights?.length)?.reverse()?.map((element) => moment(element.created_at).local().format('HH:mm')) ?? [],
                datasets: [
                  {
                    data: data?.tray?.[0]?.stocks?.[0]?.weights?.slice(Math.max(0, data?.tray?.[0]?.stocks?.[0]?.weights?.length - 6), data?.tray?.[0]?.stocks?.[0]?.weights?.length)?.reverse()?.map((element) => element.value) ?? [],
                  },
                ]
              }}
              style={{
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").width * 9 / 16
              }}
              yAxisSuffix="g"
              backgroundColor="#18ffff"
              backgroundGradientFrom="#00e676"
              backgroundGradientTo="#32cb00"
              />}
            data={data?.tray?.[0]?.stocks?.[0]?.weights.map((element, index) => ({
              ...element,
              delta: index === data?.tray?.[0]?.stocks?.[0]?.weights.length - 1 ? null : data?.tray?.[0]?.stocks?.[0]?.weights[index].value - data?.tray?.[0]?.stocks?.[0]?.weights[index + 1].value
            }))}
            renderItem={ListEntity}
          />) : (<Layout style={{width: Dimensions.get("window").width, alignItems: 'center'}}><Spinner/></Layout>)
          }
    </SafeAreaView>
  );
};