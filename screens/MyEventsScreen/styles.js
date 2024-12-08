/*
Aggrey Nhiwatiwa
1152301
INFO-6132 
Lab 4
*/

/*
Styles for the my Events screen and the Add Event modal.
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
    modalContainer: {
        flex: 1,
        alignItems: "center",
        padding: 10,
        paddingTop: 100,
        backgroundColor: "rgba(255, 231, 51, 0.5)",
    },
    modalTopContainer: {
        width: 380,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "left",
    },
    modalInputContainer: {
        alignItems: "left",
    },
    inputContainer: {
        fontSize: 20,
        width: 350,
        height: 40,
        textAlign: "center",
        borderWidth: 2,
        borderRadius: 4,
        borderColor: "#1E3F5A",
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 30,
        fontWeight: "600",
        marginBottom: 20,
        color: "#1E3F5A",
    },
    modalSubtitle: {
        marginTop: 10,
        fontSize: 20,
        fontWeight: "600",
        textAlign: "left",
        color: "#1E3F5A",
    },
    switchContainer: {
        flexDirection: "row",
        fontSize: 20,
        margin: 20,
        width: 350,
        height: 40,
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        borderWidth: 2,
        borderRadius: 4,
        borderColor: "#808080",
    },
    switchText: {
        fontSize: 20,
        fontWeight: "600",
        textAlign: "left",
        color: "#1E3F5A",
    },
    modalButton: {
        backgroundColor: "#1E3F5A",
        margin: 10,
        width: 100,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderRadius: 4,
    },
    modalButtonText: {
        fontSize: 20,
        fontWeight: "600",
        color: "#FFFFFF",
    },
    infoBar: {
        alignItems: "center",
        backgroundColor: "#1E3F5A",
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
});

export default styles;
