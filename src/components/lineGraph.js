import * as React from 'react';
import { LineChart } from 'react-native-chart-kit';

export default (props) => {
  return (<LineChart
    data={props.data}
    width={props.style.width || props.width} // from react-native
    height={props.style.height || props.height}
    yAxisSuffix={props.yAxisSuffix}
    withOuterLines={false}
    withDots={false}
    withShadow={true}
    chartConfig={{
      backgroundColor: props.backgroundColor,
      backgroundGradientFrom: props.backgroundGradientFrom,
      backgroundGradientTo: props.backgroundGradientTo,
      color: (opacity=1) => `rgba(255, 255, 255, 0.8)`,
      labelColor: (opacity) => `rgba(255, 255, 255, 1)`,
      decimalPlaces: 2, // optional, defaults to 2dp
      style: {
        borderRadius: 0,
      },
    }}
    bezier
  />);
}