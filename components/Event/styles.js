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
        backgroundColor: "#1E3F5A",
        borderRadius: 4,
    },
    dateBoxText: {
        fontSize: "18",
        fontWeight: "600",
        color: "#FFFFFF",
    },
    mainHeading: {
        fontSize: "22",
        fontWeight: "600",
    },
    subHeading: {
        fontSize: "18",
        fontWeight: "400",
        color: "#5C5C5C",
    },
    descriptionHeading: {
        fontSize: "16",
        fontStyle: "italic",
        color: "#5C5C5C",
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
    modalButton: {
        backgroundColor: "#1E3F5A",
        margin: 10,
        width: 160,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderRadius: 4,
    },
    deleteButton: {
        backgroundColor: "red",
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
