import styles from "./styles";
import { Text, View } from "react-native";

/*
Custom box to display messages to the user for user input.
*/
export default function InputMsgBox(props) {
    return (
        <View style={styles.container}>
            <Text style={styles.buttonText}>{props.text}</Text>
        </View>
    );
}
