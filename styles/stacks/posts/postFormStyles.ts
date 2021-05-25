import { StyleSheet } from "react-native"
import { lightGrey } from "../../colors"

export default StyleSheet.create({
    container: {
        height: "100%",
        padding: 15
    },
    formGrid: {
        flexDirection: "row",
        marginBottom: 20
    },
    textInputWrapper: {
        flex: 1
    },
    inputElement: {
        borderColor: lightGrey,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        padding: 3
    },
    textAreaElement: {
        height: 65,
        flexWrap: 'wrap',
        borderBottomLeftRadius: 5
    },
    buttonWrapper: {
        // paddingRight: 15,
        // paddingLeft: 15
    }
})