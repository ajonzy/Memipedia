import React, { useState, useRef } from "react"
import { TextInput, View, ScrollView } from 'react-native';
import * as SecureStore from "expo-secure-store"

import PostImagePicker from "../components/posts/PostImagePicker"
import Button from "../components/helpers/button";
import api from "../utils/api";

import postFormStyles from "../styles/stacks/posts/postFormStyles";
const {container, 
  formGrid, 
  textInputWrapper, 
  inputElement, 
  textAreaElement, 
  buttonWrapper} = postFormStyles

interface IPostFormScreenProps {
  navigation: {
    navigate: (screenName: string, data: any) => void
  }
}

export default function postFormScreen(props: IPostFormScreenProps) {
    const [name, setName] = useState("")
    const [content, setContent] = useState("")
    const [postImage, setPostImage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const imagePickerRef: any = useRef()

    const setBaseState = () => {
      setName("")
      setContent("")
      setPostImage("")
      setIsSubmitting(false)

      imagePickerRef.current.clearImage()
    }

    const buildForm = () => {
      let formData = new FormData()

      formData.append("post[name]", name)
      formData.append("post[content]", content)

      const uriParts = postImage.split(".")
      const fileType = uriParts[uriParts.length-1]

      formData.append("post[post_image]", {
        // @ts-ignore
        uri: postImage,
        name: `photo.${fileType}`,
        type: `image/${fileType}`
      })

      return formData
    }

    const handleSubmit = async () => {
      setIsSubmitting(true)
      const token = await SecureStore.getItemAsync("memipedia_secure_token")

      api.post("memipedia_posts", buildForm(), { 
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "content-type": "multipart/form-data"
        }
      })
      .then(response => {
        if (response.data.memipedia_post) {
          setBaseState()
          props.navigation.navigate("PostDetail", {post: response.data.memipedia_post})
        }
        else {
          setIsSubmitting(false)
          alert("There was an issue creating the post, all fields are required, and only images are allowed")
        }
      })
      .catch(error => {
        console.log("Error from create post", error)
        setIsSubmitting(false)
      })
    }

    return (
        <ScrollView style={container}>
          <View style={formGrid}>
              <PostImagePicker ref={imagePickerRef} setPostImage={setPostImage} />

              <View style={textInputWrapper}>
                <TextInput 
                  placeholder="Name"
                  value={name}
                  onChangeText={val => setName(val)}
                  style={inputElement}
                  // returnKeyType="next"
                  // onSubmitEditing={() => passwordInput.current.focus()}
                  // blurOnSubmit={false}
                />

                <TextInput 
                  placeholder="Description"
                  value={content}
                  onChangeText={val => setContent(val)}
                  multiline={true}
                  style={[inputElement, textAreaElement]}
                  numberOfLines={5}
                  textAlignVertical={"top"}
                  textBreakStrategy={"highQuality"}
                  // returnKeyType="next"
                  // onSubmitEditing={() => passwordInput.current.focus()}
                  // blurOnSubmit={false}
                />
              </View>
          </View>

          <View style={buttonWrapper}>
            <Button text={isSubmitting ? "Submitting" : "Submit"} onPress={handleSubmit} disabled={isSubmitting} />
          </View>
        </ScrollView>
    )
}