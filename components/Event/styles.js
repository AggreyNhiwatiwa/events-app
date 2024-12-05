/*
Aggrey Nhiwatiwa
1152301
INFO-6132 
Lab 4
*/

/*
Styling for each individual Book component
*/
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        marginTop: 8,
        width: 380,
        height: 180,
        paddingLeft: 14,
        paddingRight: 14,
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: "#FCF5E5",
        borderWidth: 2,
        borderRadius: 6,
    },
    image: {
        width: 100,
        height: 160,
        borderRadius: 8,
    },
    leftContainer: {
        width: 100,
        height: 180,
        justifyContent: "center",
    },
    rightContainer: {
        width: 280,
        height: 180,
        alignItems: "flex-start",
        paddingLeft: 40,
        paddingTop: 6,
    },
    mainHeading: {
        fontSize: "24",
        fontWeight: "1000",
    },
    subHeading: {
        fontSize: "20",
        fontWeight: "1000",
        color: "#5C5C5C",
    },
    borrowedText: {
        color: "#8A0000",
    },
    availableText: {
        color: "#007038",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
    inputContainer: {
        fontSize: 20,
        margin: 20,
        width: 350,
        height: 40,
        textAlign: "center",
        borderWidth: 2,
        borderRadius: 4,
        borderColor: "#808080",
    },
    modalButton: {
        // fontSize: 20,
        //backgroundColor: "#000000",

        margin: 10,
        width: 100,
        height: 40,
        textAlign: "center",
        alignItems: "center",
        borderWidth: 2,
        borderRadius: 4,
        borderColor: "#808080",
    },

    modalButtonText: {
        fontSize: 20,
    },

    switchContainer: {
        flexDirection: "row",
        fontSize: 20,
        margin: 20,
        width: 240,
        height: 40,
        textAlign: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderRadius: 4,
        borderColor: "#808080",
    },

    switchText: {
        fontSize: 20,
    },
});

export default styles;
