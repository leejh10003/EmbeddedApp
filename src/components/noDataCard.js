import * as React from 'react';
import { View, Dimensions } from 'react-native';
import { Text, Card} from '@ui-kitten/components';
import LinearGradient from 'react-native-linear-gradient';

export default ({colors, title, subtitle, style}) => (<Card
  style={{
    ...style
  }}
  header={() => (<View
    style={{
      alignItems: 'center',
      justifyContent: 'center',
      width: Dimensions.get("window").width - 80,
      height: 220
    }}
  ><LinearGradient colors={colors}
    start={{
      x: 0,
      y: 1,
    }}
    end={{ x: 1, y: 0 }}
  style={{
    height: 220,
    width: Dimensions.get("window").width - 80,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  }}>
    <Text category="h2">자료 없음</Text>
</LinearGradient></View>)}
>
<Text category="h5">{title}</Text>
<View style={{marginTop: 10, flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
  <Text style={{color: 'grey'}}>{subtitle}</Text>
  <Text style={{fontWeight: 'bold'}}>자료 없음</Text>
</View>
</Card>)