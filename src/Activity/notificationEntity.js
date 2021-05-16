import * as React from 'react';
import { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card , Icon, Layout } from '@ui-kitten/components';
import theme from '../../theme.json';
import moment from 'moment';

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
export const EmptyIcon = () => {
  const animationRef = React.useRef();
  useEffect(() => {
    animationRef.current.startAnimation();
  })
  return (<Layout style={{alignItems: 'center'}}>
    <Icon style={{
      height: 60,
      width: 60,
    }}
    ref={animationRef}
    fill='grey'
    animation='shake'
    name='loader-outline'/>
    <Layout style={{ marginBottom: 30 }} />
    <Text category='s2'>알림 내용이 없습니다.</Text>
  </Layout>)
}
export default ({item, navigation}) => (
  <Card
    status={item.kind}
    header={headerProps => renderItemHeader(headerProps, item)}
    style={{
      marginBottom: 10
    }}
    onPress={() => console.log(JSON.stringify(navigation))}
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
      {moment(item.created_at).local().format('YYYY-MM-DD HH:mm:ss')}
    </Text>
  </Card>
);