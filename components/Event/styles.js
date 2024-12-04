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
});

export default styles;
