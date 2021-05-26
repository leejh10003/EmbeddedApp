import * as React from 'react';
import { View, Dimensions, Image } from 'react-native';
import { Text, Layout, Icon, Card} from '@ui-kitten/components';
const getCelsius = (temp) => !!!(temp) || isNaN(temp) ? '정보 없음' : `${temp - 273}`
export default ({item, style, navigation}) => (<Card
  style={style}
  onPress={() => navigation.navigate('트레이', {id: item.id, name: item.name})}
  header={() => (
    <View style={{flexDirection:'row', alignItems:'center'}}>
      <Image source={{uri: item?.thumbnail?.[0]?.weights?.[0]?.images?.[0]?.url}}
        style={{width: Dimensions.get('window').width - 80, height: (Dimensions.get('window').width - 80) * 9 / 16}} />
    </View>)}>
  <Text category='h5'>
    {item.name}
  </Text>
  <View style={{marginTop: 10, flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
    <Text style={{color: 'grey'}}>현재 재료</Text>
    <Text style={{fontWeight: 'bold'}}>{item?.stocks?.[0]?.name ?? '정보 없음'}</Text>
  </View>
  <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
    <Text style={{color: 'grey'}}>남은 재료 무게</Text>
    <Text style={{fontWeight: 'bold'}}>{item?.stocks?.[0]?.weights?.[0]?.value != undefined ?  `${item?.stocks?.[0]?.weights?.[0]?.value}g` : '정보 없음'}</Text>
  </View>
  <View style={{marginTop: 5, flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
    <Icon style={{width: 16, height: 16}} fill='grey' name='thermometer-outline'/>
    <Text>{getCelsius(item?.stocks?.[0]?.humidity_temperatures?.[0]?.temperature)}</Text>
    <Layout style={{marginRight: 10}}/>
    <Icon style={{width: 16, height: 16}} fill='grey' name='droplet-outline'/>
    <Text>{item?.stocks?.[0]?.humidity_temperatures?.[0]?.humidity != undefined ? + `${item?.stocks?.[0]?.humidity_temperatures?.[0]?.humidity}%` : '정보 없음'}</Text>
  </View>
</Card>)