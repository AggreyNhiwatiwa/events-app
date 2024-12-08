/*
Aggrey Nhiwatiwa
1152301
INFO-6132 
Lab 4
*/

/*
Component that simply renders the list of Events from the Database
*/
import { FlatList, Text, View } from "react-native";
import { useCallback, useContext } from "react";
import styles from "./styles";
import { useFocusEffect } from "@react-navigation/native";
import { EventContext } from "../../context/EventContext";
import Event from "../../components/Event";

export default function AllEventsScreen() {
    const { events, setInFavouriteMode, setInEditingMode } =
        useContext(EventContext);

    /*
  useFocusEffect hook to ensure that whenever the Events screen is navigated to, the
  global boolean for inBorrowingMode is set to false
  */
    useFocusEffect(
        useCallback(() => {
            setInFavouriteMode(false);
            setInEditingMode(false);
        }, [])
    );

    const renderItem = ({ item }) => (
        <Event
            id={item.id}
            authorId={item.authorId}
            title={item.title}
            isFavourite={item.isFavourite}
            description={item.description}
            date={item.date}
            time={item.time}
        ></Event>
    );

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.flatListContent}
                data={events}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
            <View style={styles.infoBar}>
                <Text style={styles.infoBarText}>
                    Press an event to favourite it
                </Text>
            </View>
        </View>
    );
}
