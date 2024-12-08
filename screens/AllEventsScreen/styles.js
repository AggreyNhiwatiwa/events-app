/*
Aggrey Nhiwatiwa
1152301
INFO-6132 
Lab 4
*/

/*
Styles for the all Events screen
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
