import React from 'react';
import { createAppContainer } from "react-navigation"
import {StatusBar} from "react-native"

import router from "./utils/router"
import CurrentUserProvider from './providers/CurrentUserProvider';

const AppContainer = createAppContainer(router)

export default function App() {
  return <CurrentUserProvider>
    <StatusBar barStyle="light-content" />
    <AppContainer />
  </CurrentUserProvider>
}
