/*
Aggrey Nhiwatiwa
1152301
INFO-6132 
Lab 4
*/

/*
Styles for the my Events screen
*/
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    flatListContent: {
        flexGrow: 1,
    },
    infoBar: {
        alignItems: "center",
        backgroundColor: "#000000",
        width: 400,
        height: 40,
        justifyContent: "center",
        marginBottom: 0,
        borderWidth: 0,
    },
    infoBarText: {
        color: "#FFE733",
        fontStyle: "italic",
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

    modalTitle: {
        fontSize: 30
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
        fontSize: 20
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
