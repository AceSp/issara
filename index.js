/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { StateProvider } from './src/utils/store';
import { ApolloProvider } from '@apollo/client';
import { client } from './src/utils/apollo-client';

const app = () => (
  <ApolloProvider client={client}>
    <StateProvider>
      <App />
    </StateProvider>
  </ApolloProvider>
);

AppRegistry.registerComponent(appName, () => app);