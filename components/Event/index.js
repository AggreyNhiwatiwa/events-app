/*
Aggrey Nhiwatiwa
1152301
INFO-6132 
Lab 4
*/

/*
Component that renders an Event item using database data
*/

import styles from "./styles";
import { useContext } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as database from "../../database";
import { EventContext } from "../../context/EventContext";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Alert } from "react-native";

export default function Event({
    id,
    authorId,
    title,
    isFavourite,
    description,
    date,
    time,
}) {
    const {
        events,
        setEvents,
        favouritedEvents,
        setFavouritedEvents,
        setCurrentEvent,
        inFavouriteMode,
    } = useContext(EventContext);
    const navigation = useNavigation();

    console.log("favvvmode: ", inFavouriteMode);
    /*
  Press handler with 2 internal Event press handler actions, which action is triggered 
  upon press depends on the value of the global inFavouriteMode variable.

  If the Events screen is shown, the inFavouriteMode variable is set to false and clicking an Event component 
  will not do anything

  If the Favourite screen is shown, the inFavouriteMode variable is set to true and clicking an Event
  component brings up an alert which enables a user to unfavourite an Event.

  Note, each attribute relates to the current book 
  */

    const handleEventPress = () => {
        //Means an event cannot be added to favourites multiple times
        if (!inFavouriteMode && !isFavourite) {
            Alert.alert("Add to favourites?", `Add ${title} to favourites?`, [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: () => {
                        console.log("OK Pressed");
                        addToFavourites();
                    },
                },
            ]);
        } else if(inFavouriteMode && isFavourite){
            Alert.alert(
                "Remove from favourites?",
                `Remove ${title} from your favourites?`,
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                    },
                    {
                        text: "OK",
                        onPress: () => {
                            console.log("OK Pressed");
                            removeFromFavourites();
                        },
                    },
                ]
            );
        }
    };

    //Add favourite event
    const addToFavourites = async () => {
        try {
            await database.updateEvent(id, true);

            //Creating a new array with the updated Events's new false value to trigger a re-render (as nested)
            //Also setting the current event as the event with an updated value to trigger a re-render
            const updatedEvents = events.map((event) => {
                if (event.id === id) {
                    const updatedEvent = { ...event, isFavourite: true };

                    //Go through favourite events array and remove item with matching ID to current item
                    const updatedFavouriteEvents = [
                        ...favouritedEvents,
                        updatedEvent,
                    ];
                    setFavouritedEvents(updatedFavouriteEvents);

                    return updatedEvent;
                }
                return event;
            });

            setEvents(updatedEvents);
        } catch (error) {
            console.log("Error loading data from the db:", error);
        }
    };

    //Remove favourite event

    const removeFromFavourites = async () => {
        try {
            // Await the database update and remove the .then() chain
            await database.updateEvent(id, false);

            //Go through favourite events array and remove item with matching ID to current item
            const updatedFavouriteEvents = favouritedEvents.filter(
                (event) => event.id !== id
            );

            setFavouritedEvents(updatedFavouriteEvents);

            //Creating a new array with the updated Events's new false value to trigger a re-render (as nested)
            //Also setting the current event as the event with an updated value to trigger a re-render
            const updatedEvents = events.map((event) => {
                if (event.id === id) {
                    const updatedEvent = { ...event, isFavourite: false };
                    setCurrentEvent(updatedEvent);
                    return updatedEvent;
                }
                return event;
            });

            setEvents(updatedEvents);
        } catch (error) {
            console.log("Error loading data from the db:", error);
        }
    };

    return (
        <Pressable style={styles.container} onPress={handleEventPress}>
            <View style={styles.leftContainer}>
                <MaterialCommunityIcons name={"calendar-month"} size={30} />
            </View>

            <View style={styles.rightContainer}>
                <Text style={styles.mainHeading}>{title}</Text>
                <Text style={styles.subHeading}>{description}</Text>

                <Text
                    style={[
                        styles.subHeading,
                        isFavourite
                            ? styles.borrowedText
                            : styles.availableText,
                    ]}
                >
                    {isFavourite ? "Favourite" : "Not favourite"}
                </Text>
            </View>
        </Pressable>
    );
}
