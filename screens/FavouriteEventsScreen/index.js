/*
Aggrey Nhiwatiwa
1152301
INFO-6132 
Lab 4
*/

/*
Simply renders the list of favourited events.
Similar logic to the all events screen, but only gets the favourite events from the context
*/
import { FlatList, Text, View } from "react-native";
import { useCallback, useContext } from "react";
import styles from "./styles";
import { useFocusEffect } from "@react-navigation/native";
import { EventContext } from "../../context/EventContext";
import Event from "../../components/Event";

export default function FavouriteEventsScreen() {

  const { events, favouritedEvents, setInFavouriteMode, setInEditingMode } = useContext(EventContext);

  /*
  useFocusEffect hook to ensure that whenever the FavouritesScreen is navigated to, the
  global boolean for inFavouriteMode is set to true, which allows event UI items to have
  favourite specific onPress actions
  */
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
    <View style={styles.container}>
      <FlatList
        style={styles.flatListContent}
        data={favouritedEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <View style={styles.infoBar}>
        {favouritedEvents.length === 0 ? (
          <Text style={styles.infoBarText}>No events added to favourites</Text>
        ) : (
          <Text style={styles.infoBarText}>Press an event to remove it from your favourites</Text>
        )}
      </View>
    </View>
  );
}
