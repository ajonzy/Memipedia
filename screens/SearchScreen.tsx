import React, {useState} from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import * as SecureStore from "expo-secure-store"
// @ts-ignore
import Ionicons from "react-native-vector-icons/Ionicons"

import Container from "../components/layouts/Container"
import PostsList from "../components/posts/postList"
import api from '../utils/api';

import searchStyles from "../styles/stacks/posts/searchStyles"
const {
  searchFormContainer,
  searchTextInput,
  searchIcon
} = searchStyles

interface ISearchScreenProps {
  navigation: {
    navigate: (arg: string) => void
  }
}

export default function feedScreen(props: ISearchScreenProps) {
  const [query, setQuery] = useState("")
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [emptyQuery, setEmptyQuery] = useState(false)

  const handleSearch = async () => {
    setIsLoading(true)
    setEmptyQuery(false)
    const token = await SecureStore.getItemAsync("memipedia_secure_token")

    const params = {
      query
    }

    const headers = {
      Authorization: `Bearer ${token}`
    }
    
    api.get("memipedia_queries", {
      params,
      headers
    })
    .then(response => {
      if (response.data.memipedia_posts.length === 0) {
        setEmptyQuery(true)
      }
      setPosts(response.data.memipedia_posts)
      setIsLoading(false)
    })
    .catch(error => {
      console.log("Error in Search", error)
      setIsLoading(false)
      alert("Error running query")
    })
  }

  const queryRenderer = () => {
    if (emptyQuery) {
      return <View style={{paddingLeft: 20, paddingRight: 15}}>
        <Text style={{color: "white"}}>There were no posts matching your search</Text>
      </View>
    }
    else {
      return <PostsList getPosts={handleSearch} isLoading={isLoading} posts={posts} navigate={props.navigation.navigate} />
    }
  }

  const searchBar = (
    <View style={searchFormContainer}>
      <TextInput
        value={query}
        onChangeText={val => setQuery(val)}
        placeholder="Search"
        onSubmitEditing={handleSearch}
        style={searchTextInput}
      ></TextInput>

      <TouchableOpacity style={searchIcon} onPress={handleSearch}>
        <Ionicons name="md-search" color="white" size={30} />
      </TouchableOpacity>
    </View>
  )

  return <Container navigate={props.navigation.navigate}>
    {searchBar}

    {queryRenderer()}
  </Container>
}