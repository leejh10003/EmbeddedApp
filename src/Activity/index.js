import * as React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, Divider, Layout, Spinner, Icon, Card} from '@ui-kitten/components';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import theme from '../../theme.json';
import NotificationScreen from './notification';
import NotificationEntity, { EmptyIcon } from './notificationEntity';
import Carousel from 'react-native-snap-carousel';
import Tray from './trayCard';
import moment from 'moment';
import LineGraphCard from '../components/lineGraphCard';
import Temperature from './temperature';
import Humidity from './humidity';
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    margin: 2,
  },
});

const GET_CURRENT_ACTIVITIES = gql`query{
  temperature_humidity: stock{
    id
    name
    humidity_temperatures(order_by: {id:asc}, limit: 6){
      id
      temperature
      humidity
      created_at
    }
  }
  notification(limit: 3, order_by: [{id: desc}]){
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
  tray(order_by: {id: asc}){
    name
    stocks(limit: 1, order_by: {id: desc}){
      name
      humidity_temperatures(limit: 1, order_by: {id: desc}){
        temperature
        humidity
      }
      weights(limit: 1, order_by: {id:desc}){
        value
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
function ActivityScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { loading, error, data, refetch } = useQuery(GET_CURRENT_ACTIVITIES);
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }} >
      <Divider />
      <ScrollView>
        <Layout style={{
          flex: 1
        }}>
          <Text
            category='h1'
            style={{
              marginTop: 40 + insets.top,
              paddingLeft: 20,
              paddingRight: 20
            }}>알림</Text>
          <Text
            category='s2'
            style={{
              marginTop: 5,
              paddingBottom: 40,
              paddingLeft: 20,
              paddingRight: 20
            }}
            >그동안 냉장고에서는 어떤 일이 있었을까요?</Text>
          {loading === false ? (data.notification.length > 0 ? (
            <Layout style={{
              flex: 1,
              paddingLeft: 20,
              paddingRight: 20,
            }}>
              {data.notification.map((item) => <NotificationEntity item={item} navigation={navigation}/>)}
            </Layout>
          ) : <EmptyIcon />) : <Spinner/>}
          <Layout style={{
            alignItems: 'flex-end',
            paddingLeft: 20,
            paddingRight: 20
          }}>
            <Button onPress={() => navigation.navigate('알림')} style={{
              ...styles.button,
              width: 'auto'}} appearance='ghost' status='primary' accessoryRight={() => <Icon style={{width: 16, height: 16}} fill={theme['color-primary-600']} name='arrow-circle-right-outline'/>}>
              알림 더 보기
            </Button>
          </Layout>
          <Layout style={{paddingBottom: 20}} />
          <Divider style={{
            marginLeft: 20,
            marginRight: 20,
          }}/>
          <Text
            category='h1'
            style={{
              marginTop: 30,
              paddingLeft: 20,
              paddingRight: 20
            }}>트레이</Text>
          <Text
            category='s2'
            style={{
              marginTop: 5,
              paddingBottom: 40,
              paddingLeft: 20,
              paddingRight: 20
            }}
            >트레이의 현재상태를 볼까요?</Text>
            {loading === false ? (data.tray.length > 0 ? <Carousel
              data={data.tray}
              layout={'default'}
              sliderWidth={Dimensions.get('window').width}
              itemWidth={Dimensions.get('window').width - 80}
              loop={true}
              inactiveSlideShift={0}
              useScrollView={true}
              renderItem={({item, index}) => (
                <Tray item={item} />
              )}
            /> : <EmptyIcon />) : <Spinner/>}
          <Layout style={{paddingBottom: 20}} />
          <Divider style={{
            marginLeft: 20,
            marginRight: 20,
          }}/>
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
            >안정적인 온도를 유지하세요!</Text>
            {loading === false ? (
              <Carousel
                data={data.temperature_humidity}
                layout={'default'}
                sliderWidth={Dimensions.get('window').width}
                itemWidth={Dimensions.get('window').width - 80}
                loop={true}
                inactiveSlideShift={0}
                useScrollView={true}
                renderItem={({item, index}) => {
                  if (item?.humidity_temperatures?.length > 0){
                    return (
                      <LineGraphCard
                      onPress={() => navigation.navigate('온도', {id: item.id, name: item.name})}
                      data={{
                        labels: item?.humidity_temperatures?.map((element) => moment(element.created_at).local().format('HH:mm')) ?? [],
                        datasets: [
                          {
                            data: item?.humidity_temperatures?.map((element) => element.temperature - 273) ?? [],
                          },
                        ]
                      }}
                      yAxisSuffix="°C"
                      backgroundColor="#18ffff"
                      backgroundGradientFrom="#ff79b0"
                      backgroundGradientTo="#f50057"
                      name={item.name}
                      body={(<View style={{marginTop: 10, flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{color: 'grey'}}>평균 온도</Text>
                        <Text style={{fontWeight: 'bold'}}>{(item?.humidity_temperatures?.map((element) => element?.temperature - 273)?.reduce((prev, next) => prev + next, 0) / Math.max(item?.humidity_temperatures?.length, 1)).toFixed(2)}°C</Text>
                      </View>)}
                    />);
                  } else {
                    return (<Card></Card>)
                  }
                }}
              />) : <Spinner />}
          
          <Layout style={{paddingBottom: 20}} />
          <Divider style={{
            marginLeft: 20,
            marginRight: 20,
          }}/>
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
            >적당한 습도는 신선도 유지에 필수!</Text>
            {loading === false ? (
              <Carousel
                data={data.temperature_humidity}
                layout={'default'}
                sliderWidth={Dimensions.get('window').width}
                itemWidth={Dimensions.get('window').width - 80}
                loop={true}
                inactiveSlideShift={0}
                useScrollView={true}
                renderItem={({item, index}) => {
                  if (item?.humidity_temperatures?.length > 0){
                    return (
                      <LineGraphCard
                      data={{
                        labels: item?.humidity_temperatures?.map((element) => moment(element.created_at).local().format('HH:mm')) ?? [],
                        datasets: [
                          {
                            data: item?.humidity_temperatures?.map((element) => element.humidity) ?? [],
                          },
                        ]
                      }}
                      yAxisSuffix="%"
                      backgroundColor="#18ffff"
                      backgroundGradientFrom="#40c4ff"
                      backgroundGradientTo="#448aff"
                      name={item.name}
                      onPress={() => navigation.navigate('습도', {id: item.id, name: item.name})}
                      body={(<View style={{marginTop: 10, flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{color: 'grey'}}>평균 습도</Text>
                        <Text style={{fontWeight: 'bold'}}>{(item?.humidity_temperatures?.map((element) => element.humidity)?.reduce((prev, next) => prev + next, 0) / Math.max(item.humidity_temperatures.length, 1)).toFixed(2)}%</Text>
                      </View>)}
                    />)
                  } else {
                    return (<Card></Card>)
                  }
                }}
              />) : <Spinner />}
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
      <HomeStack.Screen name="온도" component={Temperature} />
      <HomeStack.Screen name="습도" component={Humidity} />
    </HomeStack.Navigator>
  );
} 