import React, { useContext } from 'react';
import { View } from 'react-native';
import * as SecureStore from "expo-secure-store"

import CurrentUserContext from "../contexts/CurrentUserContext"

import Button from "../components/helpers/button"

interface IAccountScreenProps {
  navigation: {
    navigate: (arg: string) => void
  }
}

export default function accountScreen(props: IAccountScreenProps) {
    const {setCurrentUser} = useContext(CurrentUserContext)

    const handleSignout = async () => {
        await SecureStore.deleteItemAsync("memipedia_secure_token")
        setCurrentUser(null)
        props.navigation.navigate("Auth")
    }

  return <View style={{padding: 15}} >
        <Button onPress={handleSignout} text="Sign Out" />
    </View>
}