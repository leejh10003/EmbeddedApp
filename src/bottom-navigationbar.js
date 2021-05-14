import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNavigation, BottomNavigationTab, Icon } from '@ui-kitten/components';
import HomeStackScreen from './Home';
import SettingsStackScreen from './Settings';

const SettingIcon = (props) => (
  <Icon {...props} name='settings-2-outline' />
)
const HomeIcon = (props) => (
  <Icon {...props} name='home-outline' />
)
const Tab = createBottomTabNavigator();
const BottomTabBar = ({ navigation, state }) => {
  const insets = useSafeAreaInsets();
  return (
    <BottomNavigation
      selectedIndex={state.index}
      style={{
        paddingBottom: insets.bottom
      }}
      onSelect={index => navigation.navigate(state.routeNames[index])}>
      <BottomNavigationTab title='홈' icon={HomeIcon}/>
      <BottomNavigationTab title='설정' icon={SettingIcon}/>
    </BottomNavigation>
  )
};
export default () => {
  return (
    <NavigationContainer>
      <Tab.Navigator tabBar={props => <BottomTabBar {...props} />}>
        <Tab.Screen name="홈" component={HomeStackScreen} />
        <Tab.Screen name="설정" component={SettingsStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}