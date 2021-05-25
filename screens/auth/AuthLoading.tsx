import React, { useEffect, useContext } from "react"
import { View } from "react-native"
import * as SecureStore from "expo-secure-store"

import CurrentUserContext from "../../contexts/CurrentUserContext"
import api from "../../utils/api"

interface IAuthLoadingScreenProps {
    navigation: {
        navigate: (screenName: string) => void
    }
}

export default function AuthLoadingScreen(props: IAuthLoadingScreenProps) {
    const {setCurrentUser} = useContext(CurrentUserContext)

    useEffect(() => {
        checkLogin()
    }, [])

    const checkLogin = async () => {
        const token = await SecureStore.getItemAsync("memipedia_secure_token")

        if (token) {
            api.get("logged_in", { 
                headers: {
                    Authorization: `Bearer ${token}`
                }
             })
             .then(response => {
                 if (response.data.memipedia_user) {
                     setCurrentUser(response.data.memipedia_user)
                     props.navigation.navigate("App")
                }
                else {
                    setCurrentUser(null)
                    props.navigation.navigate("Auth")
                }
             })
             .catch(error => {
                alert("Error logging in")
                setCurrentUser(null)
                props.navigation.navigate("Auth")
             })
        }
        else {
            setCurrentUser(null)
            props.navigation.navigate("Auth")
        }
    }

    return <View />
}