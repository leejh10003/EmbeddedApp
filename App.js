import * as React from 'react';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { ThemeContext } from './src/theme-context';
import * as eva from '@eva-design/eva';
import messaging from '@react-native-firebase/messaging';
import TabsNavigator from './src/bottom-navigationbar';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from, Web, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from "@apollo/client/link/ws";
import { RetryLink } from '@apollo/client/link/retry';
const client = new ApolloClient({
  link: split(
    ({query}) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    new WebSocketLink({
      uri: "ws://ec2-3-36-171-69.ap-northeast-2.compute.amazonaws.com:8080/v1/graphql", // use wss for a secure endpoint
      options: {
        reconnect: true
      }
    }),
    new HttpLink({
      uri: 'http://ec2-3-36-171-69.ap-northeast-2.compute.amazonaws.com:8080/v1/graphql',
    })
  ),
  cache: new InMemoryCache()
});
const App = () => {
  const [theme, setTheme] = React.useState('light');
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };
  useEffect(async () => {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      await messaging().subscribeToTopic('TO_ALL_USER')
    }
  });
  return (
    <ApolloProvider client={client}>
      <IconRegistry icons={EvaIconsPack}/>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <ApplicationProvider {...eva} theme={eva[theme]}>
          <SafeAreaProvider>
            <TabsNavigator />
          </SafeAreaProvider>
        </ApplicationProvider>
      </ThemeContext.Provider>
    </ApolloProvider>
  );
}
export default App