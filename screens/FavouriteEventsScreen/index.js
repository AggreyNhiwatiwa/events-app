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
Component that simply renders the favourites list of a specific user.
useFocusEffect helps update the global state to ensure each event
item has its correct onPress action
*/
export default function FavouriteEventsScreen() {
    const { favouritedEvents, setInFavouriteMode, setInEditingMode } =
        useContext(EventContext);

    useFocusEffect(
        useCallback(() => {
            setInFavouriteMode(true);
            setInEditingMode(false);
        }, [])
    );

    const renderItem = ({ item }) => (
        <Event
            id={item.id}
            authorId={item.authorId}
            title={item.title}
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
                    data={favouritedEvents}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />
                <View style={styles.infoBar}>
                    {favouritedEvents.length === 0 ? (
                        <Text style={styles.infoBarText}>
                            No events added to favourites
                        </Text>
                    ) : (
                        <Text style={styles.infoBarText}>
                            Press an event to remove it from your favourites
                        </Text>
                    )}
                </View>
            </View>
        </>
    );
}
