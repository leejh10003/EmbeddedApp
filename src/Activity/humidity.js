import React from 'react';
import { SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { Divider, Icon, Layout, Text, TopNavigation, TopNavigationAction, Spinner, List, ListItem } from '@ui-kitten/components';
import { useSubscription } from '@apollo/client';
import gql from 'graphql-tag';
import LineGraph from '../components/lineGraph';
import moment from 'moment';

const BackIcon = (props) => (
  <Icon {...props} name='arrow-back' />
);

const HUMIDITY_SUBSCRIPTION = gql`subscription HumiditySubscription($id: Int!){
  stock(where: {id: {_eq: $id}}){
    name
    humidity_temperatures(order_by: {id:desc}){
      id
      humidity
      created_at
    }
  }
}`

const ListEntity = ({item, index}) => (<ListItem 
  accessoryLeft={() => (<Icon style={{width: 30, height: 30}} fill={item.delta === null || item.delta === 0 ? `grey` : (item.delta > 0 ? "#ff79b0" : "#40c4ff") } name={item.delta === null || item.delta === 0 ? `droplet-outline` : (item.delta > 0 ? `droplet` : `droplet-off-outline`)}/>)}
  title={`${item.humidity}%`}
  accessoryRight={() => <Layout style={{alignItems: 'center'}}>
    <Layout style={{flexDirection:'row', alignItems:'center'}}>{item.delta !== null && item.delta !== 0 ? <Icon style={{width: 10, height: 10}}  fill={item.delta > 0 ? `red` : `blue`} name={item.delta > 0 ? `arrow-up-outline` : `arrow-down-outline`}/> : null}<Text style={{color: item.delta != null && item.delta !== 0 ? (item.delta > 0 ? `red` : `blue`) : `grey`}}>{item.delta !== null ? `${Math.abs(item.delta)}` : `-`}</Text></Layout>
    <Text style={{fontSize: 10, color: 'grey'}}>{moment(item.created_at).local().format('HH:mm')}</Text>
  </Layout>}
/>)

export default ({navigation, route: {params: { id, name }}}) => {
  const { data, loading, error } = useSubscription(HUMIDITY_SUBSCRIPTION, {
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
      <TopNavigation title={`${name} 습도`} alignment='center' accessoryLeft={BackAction}/>
      <Divider/>
        {
          loading === false ? (
          <List
            ItemSeparatorComponent={Divider}
            ListHeaderComponent={<LineGraph
              data={{
                labels: data?.stock?.[0]?.humidity_temperatures?.slice(Math.min(0, data?.stock?.[0]?.humidity_temperatures?.length - 6), data?.stock?.[0]?.humidity_temperatures?.length)?.reverse()?.map((element) => moment(element.created_at).local().format('HH:mm')) ?? [],
                datasets: [
                  {
                    data: data?.stock?.[0]?.humidity_temperatures?.slice(Math.min(0, data?.stock?.[0]?.humidity_temperatures?.length - 6), data?.stock?.[0]?.humidity_temperatures?.length)?.reverse()?.map((element) => element.humidity) ?? [],
                  },
                ]
              }}
              style={{
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").width * 9 / 16
              }}
              yAxisSuffix="%"
              backgroundColor="#18ffff"
              backgroundGradientFrom="#40c4ff"
              backgroundGradientTo="#448aff"
              />}
            data={data?.stock?.[0]?.humidity_temperatures.map((element, index) => ({
              ...element,
              delta: index === data?.stock?.[0]?.humidity_temperatures.length - 1 ? null : data?.stock?.[0]?.humidity_temperatures[index].humidity - data?.stock?.[0]?.humidity_temperatures[index + 1].humidity
            }))}
            renderItem={ListEntity}
          />) : (<Layout style={{width: Dimensions.get("window").width, alignItems: 'center'}}><Spinner/></Layout>) 
        }
    </SafeAreaView>
  );
};