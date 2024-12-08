/*
Aggrey Nhiwatiwa
1152301
INFO-6132 
Lab 4
*/

// React imports
import { useCallback, useContext } from "react";
import { FlatList, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

// Project imports
import styles from "./styles";
import { EventContext } from "../../context/EventContext";
import Event from "../../components/Event";

/*
Component that simply renders the list global of Events from the Database
These events are shared by all users.
useFocusEffect helps update the global state to ensure each event
item has its correct onPress action
*/
export default function AllEventsScreen() {
    const { events, setInFavouriteMode, setInEditingMode } =
        useContext(EventContext);

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
        <>
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
        </>
    );
}
