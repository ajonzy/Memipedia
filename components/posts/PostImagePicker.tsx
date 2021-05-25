import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
// @ts-ignore
import EvilIcons from "react-native-vector-icons/EvilIcons"
import { primary, lightGrey } from '../../styles/colors';

interface IPostImagePickerProps {
    setPostImage: (arg: any) => void
}

function imagePickerExample(props: IPostImagePickerProps, ref: any) {
  const [image, setImage] = useState("")

  useImperativeHandle(ref, () => ({
      clearImage() {
          setImage("")
      }
  }))

    useEffect(() => {
        getPermissionAsync()
    }, [])

    const getPermissionAsync = async () => {
        // @ts-ignore
      if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    };

    const pickImage = async () => {
      try {
        let result: any = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
        //   allowsEditing: true,
        //   aspect: [4, 3],
          quality: 1,
        });
        if (!result.cancelled) {
          setImage(result.uri);
          props.setPostImage(result.uri)
        }
  
        console.log(result);
      } catch (E) {
        console.log(E);
      }
    };

    const sizeStyles = {
        width: 100,
        height: 100
    }

    return (
        <TouchableOpacity onPress={pickImage} style={[sizeStyles, {justifyContent: "center", alignItems: "center", marginRight: 20, borderColor: lightGrey, borderWidth: 1, borderRadius: 5}]} >
            {image ? (
                <Image source={{uri: image}} style={[sizeStyles, {borderRadius: 5}]} />
            ) : (
                <EvilIcons name="camera" color={primary} size={42} />
            )}
        </TouchableOpacity>
    );
}

export default forwardRef(imagePickerExample)