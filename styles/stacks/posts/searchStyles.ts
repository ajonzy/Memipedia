import { StyleSheet } from "react-native"
import { RFValue } from "react-native-responsive-fontsize"

export default StyleSheet.create({
    searchFormContainer: {
        padding: 15,
        flexDirection: "row"
    },
    searchTextInput: {
        backgroundColor: "white",
        width: "85%",
        borderRadius: 25,
        fontWeight: "500",
        paddingLeft: 21
    },
    searchIcon: {
        justifyContent: "center",
        alignItems: "center",
        width: "15%"
    }
})