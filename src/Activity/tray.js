import React from 'react';
import { SafeAreaView, ScrollView, Dimensions, View, Image } from 'react-native';
import { Divider, Icon, Layout, Text, TopNavigation, TopNavigationAction, Spinner, List, ListItem } from '@ui-kitten/components';
import { useSubscription } from '@apollo/client';
import gql from 'graphql-tag';
import LineGraphCard from '../components/lineGraphCard';
import NoDataCard from '../components/noDataCard';
import moment from 'moment';

const BackIcon = (props) => (
  <Icon {...props} name='arrow-back' />
);

const TRAY_SUBSCRIPTION = gql`subscription TraySubscription($id: Int!){
  tray(where: {id: {_eq: $id}}){
    name
    stocks(limit: 1, order_by: {id: desc}){
      name
      id
      humidity_temperatures(limit: 6, order_by: {id: desc}){
        id
        temperature
        humidity
        created_at
      }
      weights(limit: 6, order_by: {id:desc}){
        value
        created_at
      }
    }
    thumbnail: stocks(limit: 1, where: {weights: {images: {}}}, order_by: {id: desc}){
      weights(limit: 1, where: {images: {}}, order_by: {id: desc}){
        images(limit: 1, order_by: {id: desc}){
          url
        }
      }
    }
  }
}`

export default ({navigation, route: {params: { id, name }}}) => {
  const { data, loading, error } = useSubscription(TRAY_SUBSCRIPTION, {
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
      <TopNavigation title={`${name}`} alignment='center' accessoryLeft={BackAction}/>
      <Divider/>
        {
          loading === false ? (
            <ScrollView>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <Image source={{uri: data?.tray?.[0]?.thumbnail?.[0]?.weights?.[0]?.images?.[0]?.url}}
                  style={{width: Dimensions.get('window').width, height: (Dimensions.get('window').width) * 9 / 16}} />
              </View>
              <Text
                category='h1'
                style={{
                  marginTop: 30,
                  paddingLeft: 20,
                  paddingRight: 20
                }}>저장량</Text>
                <Text
                  category='s2'
                  style={{
                    marginTop: 5,
                    paddingBottom: 40,
                    paddingLeft: 20,
                    paddingRight: 20
                  }}
                  >음식물 쓰레기 없이, 오늘도 화이팅!</Text>
              {data?.tray?.[0]?.stocks?.[0]?.weights?.length > 0 ? (
                <LineGraphCard
                style={{
                  width: Dimensions.get('window').width - 80,
                  marginLeft: 40
                }}
                onPress={() => navigation.navigate('저장량', {id, name })}
                data={{
                  labels: data?.tray?.[0]?.stocks?.[0]?.weights?.slice()?.reverse()?.map((element) => moment(element.created_at).local().format('HH:mm')) ?? [],
                  datasets: [
                    {
                      data: data?.tray?.[0]?.stocks?.[0]?.weights?.slice()?.reverse()?.map((element) => element.value) ?? [],
                    },
                  ]
                }}
                yAxisSuffix="g"
                backgroundColor="#18ffff"
                backgroundGradientFrom="#00e676"
                backgroundGradientTo="#32cb00"
                name={data?.tray?.[0]?.stocks?.[0].name ?? ''}
                body={(<View style={{marginTop: 10, flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text style={{color: 'grey'}}>평균 저장량</Text>
                  <Text style={{fontWeight: 'bold'}}>{(() => {var a = (data?.tray?.[0]?.stocks?.[0]?.weights?.map((element) => element.value)?.reduce((prev, next) => prev + next, 0) / Math.max(data?.tray?.[0]?.stocks?.[0]?.weights?.length, 1))?.toFixed(2); return a != undefined ? `${a}g` : ''})()}</Text>
                </View>)}
              />) : (<NoDataCard
                style={{
                  width: Dimensions.get('window').width - 80,
                  marginLeft: 40
                }}
                colors={["#9cff57", "#b0ff57"]}
                title={data?.tray?.[0]?.stocks?.[0].name ?? ''}
                subtitle="평균 저장량"
              />)}
              <Layout style={{paddingBottom: 20}} />
              <Text
                category='h1'
                style={{
                  marginTop: 30,
                  paddingLeft: 20,
                  paddingRight: 20
                }}>온도</Text>
                <Text
                  category='s2'
                  style={{
                    marginTop: 5,
                    paddingBottom: 40,
                    paddingLeft: 20,
                    paddingRight: 20
                  }}
                  >지금 냉장고는 얼마나 시원할까요?</Text>
                {data?.tray?.[0]?.stocks?.[0]?.humidity_temperatures?.length > 0 ? (
                  <LineGraphCard
                  style={{
                    width: Dimensions.get('window').width - 80,
                    marginLeft: 40
                  }}
                  onPress={() => navigation.navigate('온도', {id: data?.tray?.[0]?.stocks?.[0]?.id, name: data?.tray?.[0]?.stocks?.[0]?.name})}
                  data={{
                    labels: data?.tray?.[0]?.stocks?.[0]?.humidity_temperatures?.slice()?.reverse()?.map((element) => moment(element.created_at).local().format('HH:mm')) ?? [],
                    datasets: [
                      {
                        data: data?.tray?.[0]?.stocks?.[0]?.humidity_temperatures?.slice()?.reverse()?.map((element) => element.temperature - 273) ?? [],
                      },
                    ]
                  }}
                  yAxisSuffix="°C"
                  backgroundColor="#18ffff"
                  backgroundGradientFrom="#ff79b0"
                  backgroundGradientTo="#f50057"
                  name={data?.tray?.[0]?.stocks?.[0].name ?? ''}
                  body={(<View style={{marginTop: 10, flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: 'grey'}}>평균 온도</Text>
                    <Text style={{fontWeight: 'bold'}}>{(data?.tray?.[0]?.stocks?.[0]?.humidity_temperatures?.map((element) => element?.temperature - 273)?.reduce((prev, next) => prev + next, 0) / Math.max(data?.tray?.[0]?.stocks?.[0]?.humidity_temperatures?.length, 1)).toFixed(2)}°C</Text>
                  </View>)}
                />) : (<NoDataCard
                  style={{
                    width: Dimensions.get('window').width - 80,
                    marginLeft: 40
                  }}
                  colors={["#ffb2dd", "#ff80ab"]}
                  title={data?.tray?.[0]?.stocks?.[0].name ?? ''}
                  subtitle="평균 온도"
                />)
              }
              <Text
                category='h1'
                style={{
                  marginTop: 30,
                  paddingLeft: 20,
                  paddingRight: 20
                }}>습도</Text>
                <Text
                  category='s2'
                  style={{
                    marginTop: 5,
                    paddingBottom: 40,
                    paddingLeft: 20,
                    paddingRight: 20
                  }}
                  >너무 건조해도, 너무 습해도 안돼요!</Text>
                {data?.tray?.[0]?.stocks?.[0]?.humidity_temperatures?.length > 0 ? (
                  <LineGraphCard
                  style={{
                    width: Dimensions.get('window').width - 80,
                    marginLeft: 40
                  }}
                  onPress={() => navigation.navigate('습도', {id: data?.tray?.[0]?.stocks?.[0]?.id, name: data?.tray?.[0]?.stocks?.[0]?.name})}
                  data={{
                    labels: data?.tray?.[0]?.stocks?.[0]?.humidity_temperatures?.slice()?.reverse()?.map((element) => moment(element.created_at).local().format('HH:mm')) ?? [],
                    datasets: [
                      {
                        data: data?.tray?.[0]?.stocks?.[0]?.humidity_temperatures?.slice()?.reverse()?.map((element) => element.humidity) ?? [],
                      },
                    ]
                  }}
                  yAxisSuffix="%"
                  backgroundColor="#18ffff"
                  backgroundGradientFrom="#40c4ff"
                  backgroundGradientTo="#448aff"
                  name={data?.tray?.[0]?.stocks?.[0].name ?? ''}
                  body={(<View style={{marginTop: 10, flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: 'grey'}}>평균 습도</Text>
                    <Text style={{fontWeight: 'bold'}}>{(data?.tray?.[0]?.stocks?.[0]?.humidity_temperatures?.map((element) => element?.humidity)?.reduce((prev, next) => prev + next, 0) / Math.max(data?.tray?.[0]?.stocks?.[0]?.humidity_temperatures?.length, 1)).toFixed(2)}%</Text>
                  </View>)}
                />) : (<NoDataCard
                  style={{
                    width: Dimensions.get('window').width - 80,
                    marginLeft: 40
                  }}
                  colors={["#b5ffff", "#b6e3ff"]}
                  title={data?.tray?.[0]?.stocks?.[0].name ?? ''}
                  subtitle="평균 습도"
                />)
              }
            </ScrollView>
          ) : (<Spinner/>) 
        }
    </SafeAreaView>
  );
};