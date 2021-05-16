import LineGraph from './lineGraph';
import * as React from 'react';
import { Dimensions } from 'react-native';
import { Text, Card} from '@ui-kitten/components';

export default (props) => {
  return (<Card
    style={props.style}
    onPress={props.onPress}
    header={() => (<LineGraph
      data={props.data}
      style={{
        width: Dimensions.get("window").width - 80,
        height: 220
      }}
      yAxisSuffix={props.yAxisSuffix}
      backgroundColor={props.backgroundColor}
      backgroundGradientFrom={props.backgroundGradientFrom}
      backgroundGradientTo={props.backgroundGradientTo}
      />)}>
    <Text category='h5'>
      {props.name}
    </Text>
    {props.body}
  </Card>)
}