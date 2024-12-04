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

/*
Aggrey Nhiwatiwa
1152301
INFO-6132 
Lab 3
*/

/*
Simply renders the list of borrowed books.
Similar logic to books screen, but only gets the borrowed books list from the context, not the whole list
of Books
*/
import { FlatList, Text, View } from "react-native";
import { useCallback, useContext } from "react";
import styles from "./styles";
import { useFocusEffect } from "@react-navigation/native";
import { EventContext } from "../../context/EventContext";
import Event from "../../components/Event";

export default function FavouriteEventsScreen() {

  const { events, favouritedEvents, setInFavouriteMode } = useContext(EventContext);

  /*
  useFocusEffect hook to ensure that whenever the Borrowed screen is navigated to, the
  global boolean for inBorrowingMode is set to true 
  */
  useFocusEffect(
    useCallback(() => {
      setInFavouriteMode(true);
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
        data={favouritedEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <View style={styles.infoBar}>
        {favouritedEvents.length === 0 ? (
          <Text style={styles.infoBarText}>No events added to favourites</Text>
        ) : (
          <Text style={styles.infoBarText}>Pressn event to remove it from your favourites</Text>
        )}
      </View>
    </View>
  );
}
