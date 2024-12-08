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
        height: 100,
        paddingHorizontal: 14,
        alignItems: "center",
        justifyContent: "space-around",
        // backgroundColor: "#FCF5E5",
        borderWidth: 1.2,
        borderRadius: 6,
    },
    leftContainer: {
        width: 70,
        height: 100,
        justifyContent: "center",
        padding: 2,
    },
    centreContainer: {
        width: 300,
        height: 100,
        alignItems: "flex-start",
        paddingLeft: 20,
        paddingTop: 6,
    },
    rightContainer: {
        width: 30,
        height: 100,
        justifyContent: "center",
    },
    dateBox: {
        width: "100%",
        height: "90%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#D3D3D3",
        borderRadius: 4,
    },
    mainHeading: {
        fontSize: "22",
        fontWeight: "600",
    },
    subHeading: {
        fontSize: "18",
        fontWeight: "1000",
        color: "#5C5C5C",
    },
    descriptionHeading: {
        fontSize: "16",
        fontStyle: "italic",
        color: "#5C5C5C",
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
