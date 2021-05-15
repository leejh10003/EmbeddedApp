import * as React from 'react';
import { Icon, TopNavigationAction } from '@ui-kitten/components';
const BackIcon = (props) => (
  <Icon {...props} name='arrow-back' />
);


export default ({navigation}) => {
  const navigateBack = () => {
    navigation.goBack();
  };
  return (<TopNavigationAction icon={BackIcon} onPress={navigateBack}/>)
}