import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import * as SecureStore from "expo-secure-store"

import Container from "../components/layouts/Container"
import PostList from "../components/posts/postList"
import api from '../utils/api';

interface IFeedScreenProps {
  navigation: {
    navigate: (screenName: string, data?: any) => void
  }
}

export default function feedScreen(props: IFeedScreenProps) {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getPosts()
  }, [])

  const getPosts = async () => {
    setIsLoading(true)
    const token = await SecureStore.getItemAsync("memipedia_secure_token")

    api.get("memipedia_posts", { 
      headers: {
          Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setPosts(response.data.memipedia_posts)
      setIsLoading(false)
    })
    .catch(error => {
      console.log("Error from getPosts", error)
      setIsLoading(false)
    })
  }

  return <Container navigate={props.navigation.navigate}>
    <View>
        <PostList isLoading={isLoading} getPosts={getPosts} posts={posts} navigate={props.navigation.navigate} />
    </View>
  </Container>
}