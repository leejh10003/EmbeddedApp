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

const TEMPERATURE_SUBSCRIPTION = gql`subscription TemperatureSubscription($id: Int!){
  stock(where: {id: {_eq: $id}}){
    name
    humidity_temperatures(order_by: {id:desc}){
      id
      temperature
      created_at
    }
  }
}`

const ListEntity = ({item, index}) => (<ListItem 
  accessoryLeft={() => (<Icon style={{width: 30, height: 30}} fill={item.delta === null || item.delta === 0 ? `grey` : (item.delta > 0 ? "#ff79b0" : "#40c4ff") } name={item.delta === null || item.delta === 0 ? `thermometer-outline` : (item.delta > 0 ? `thermometer-plus-outline` : `thermometer-minus-outline`)}/>)}
  title={`${item.temperature - 273}°C`}
  accessoryRight={() => <Layout style={{alignItems: 'center'}}>
    <Layout style={{flexDirection:'row', alignItems:'center'}}>{item.delta !== null && item.delta !== 0 ? <Icon style={{width: 10, height: 10}}  fill={item.delta > 0 ? `red` : `blue`} name={item.delta > 0 ? `arrow-up-outline` : `arrow-down-outline`}/> : null}<Text style={{color: item.delta != null && item.delta !== 0 ? (item.delta > 0 ? `red` : `blue`) : `grey`}}>{item.delta !== null ? `${Math.abs(item.delta)}` : `-`}</Text></Layout>
    <Text style={{fontSize: 10, color: 'grey'}}>{moment(item.created_at).local().format('HH:mm')}</Text>
  </Layout>}
/>)

export default ({navigation, route: {params: { id, name }}}) => {
  const { data, loading, error } = useSubscription(TEMPERATURE_SUBSCRIPTION, {
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
      <TopNavigation title={`${name} 온도`} alignment='center' accessoryLeft={BackAction}/>
      <Divider/>
        {
          loading === false ? (
          <List
            ItemSeparatorComponent={Divider}
            ListHeaderComponent={<LineGraph
              data={{
                labels: data?.stock?.[0]?.humidity_temperatures?.slice(0, Math.min(data?.stock?.[0]?.humidity_temperatures?.length, 6))?.reverse()?.map((element) => moment(element.created_at).local().format('HH:mm')) ?? [],
                datasets: [
                  {
                    data: data?.stock?.[0]?.humidity_temperatures?.slice(0, Math.min(data?.stock?.[0]?.humidity_temperatures?.length, 6))?.reverse()?.map((element) => element.temperature - 273) ?? [],
                  },
                ]
              }}
              style={{
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").width * 9 / 16
              }}
              yAxisSuffix="°C"
              backgroundColor="#18ffff"
              backgroundGradientFrom="#ff79b0"
              backgroundGradientTo="#f50057"
              />}
            data={data?.stock?.[0]?.humidity_temperatures.map((element, index) => ({
              ...element,
              delta: index === data?.stock?.[0]?.humidity_temperatures.length - 1 ? null : data?.stock?.[0]?.humidity_temperatures[index].temperature - data?.stock?.[0]?.humidity_temperatures[index + 1].temperature
            }))}
            renderItem={ListEntity}
          />) : (<Layout style={{width: Dimensions.get("window").width, alignItems: 'center'}}><Spinner/></Layout>)
        }
    </SafeAreaView>
  );
};