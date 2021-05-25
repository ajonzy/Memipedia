import React, { useState, useContext, useRef } from "react"
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native"
import * as SecureStore from "expo-secure-store"

import CurrentUserContext from "../../contexts/CurrentUserContext"

import API from "../../utils/api"
import { formatErrors } from "../../utils/textFormatters"

import Button from "../../components/helpers/button"

import textInputStyles from "../../styles/forms/textInputStyles"
const { textFieldWrapper, textField } = textInputStyles
import authScreenStyles from "../../styles/stacks/auth/authScreenStyles"

interface IAuthScreenProps {
    navigation: {
      navigate: (arg: string) => void
    }
  }

export default function authScreen(props: IAuthScreenProps) {
    const [formToShow, setFormToShow] = useState("LOGIN")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const passwordInput: any = useRef()

    const {getUser} = useContext(CurrentUserContext)

    const buttonText = () => {
        if (formToShow === "LOGIN") {
            return "Login"
        }
        else if (formToShow === "REGISTER") {
            return "Register"
        }
        return ""
    }

    const screenTypeText = () => {
        if (formToShow === "LOGIN") {
            return "Need an account? Register"
        }
        else if (formToShow === "REGISTER") {
            return "Already have an account? Login"
        }
    }

    const handleAuthTypePress = () =>{
        if (formToShow === "LOGIN") {
            setFormToShow("REGISTER")
        }
        else if (formToShow === "REGISTER") {
            setFormToShow("LOGIN")
        }
    }

    const handleLogin = () => {
        const params = {
            auth: {
                email: email,
                password: password
            }
        }
        API.post("memipedia_user_token", params)
        .then(async response => {
            if (response.data.jwt) {
                await SecureStore.setItemAsync("memipedia_secure_token", response.data.jwt)
                getUser()
                setIsSubmitting(false)
                props.navigation.navigate("Feed")
            }
            else {
                alert("It looks like you typed in the wrong email or password, please try again")
                setIsSubmitting(false)
            }
        })
        .catch(error => {
            console.log("Error getting token", error)
            
            alert("It looks like you typed in the wrong email or password, please try again")

            setIsSubmitting(false)
        })
    }

    const handleRegistration = () => {
        const params = {
            user: {
                email: email,
                password: password
            }
        }
        API.post("memipedia_users", params)
        .then(response => {
            if (response.data.memipedia_user) {
                handleLogin()
            }
            else {
                alert(`Error creating account: ${formatErrors(response.data.errors)}`)
                setIsSubmitting(false)
            }
        })
        .catch(error => {
            console.log("Error getting token", error)
            
            alert("Error creating user account")

            setIsSubmitting(false)
        })
    }

    const handleSubmit = () => {
        setIsSubmitting(true)

        if (formToShow === "LOGIN") {
            handleLogin()
        }
        else {
            handleRegistration()
        }
    }

    return (
        <ScrollView style={authScreenStyles.container}>
            <View style={textFieldWrapper}>
                <TextInput 
                    placeholder="Email"
                    value={email}
                    onChangeText={val => setEmail(val)}
                    style={textField}
                    autoCapitalize="none"
                    spellCheck={false}
                    returnKeyType="next"
                    onSubmitEditing={() => passwordInput.current.focus()}
                    blurOnSubmit={false}
                />
            </View>

            <View style={textFieldWrapper}>
                <TextInput 
                    placeholder="Password"
                    value={password}
                    onChangeText={val => setPassword(val)}
                    style={textField}
                    autoCapitalize="none"
                    secureTextEntry={true}
                    onSubmitEditing={handleSubmit}
                    ref={passwordInput}
                />
            </View>

            <TouchableOpacity style={{marginTop: 10, marginBottom: 20}} onPress={handleAuthTypePress}>
                <Text style={{color: "white"}}>{screenTypeText()}</Text>
            </TouchableOpacity>

            <Button text={isSubmitting ? "Submitting" : buttonText()} onPress={handleSubmit} disabled={isSubmitting} />
        </ScrollView>
    )
}