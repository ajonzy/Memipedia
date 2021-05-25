import React from "react"
import { Image } from "react-native"

const imgPath = require("../../assets/memipedia-logo.png")

export default function headerLogo() {
    return <Image source={imgPath} style={{height: 30, width:29}} />
}