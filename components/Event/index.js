/*
Aggrey Nhiwatiwa
1152301
INFO-6132 
Lab 4
*/

/*
Component that renders an Event item using database data

An event item can have several onPress behaviours depending on the context it is displayed in.
*/

import styles from "./styles";
import { useContext, useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Button, FlatList, Modal, Switch, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as database from "../../database";
import { EventContext } from "../../context/EventContext";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

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
        inEditingMode,
    } = useContext(EventContext);
    const navigation = useNavigation();

    //State
    const [showEditModal, setShowEditModal] = useState(false);
    const [initFavourite, setInitFavourite] = useState(false);
    const [eventTitle, setEventTitle] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventTitleIsValid, setEventTitleIsValid] = useState(false);
    const [eventDescriptionIsValid, setEventDescriptionIsValid] =
        useState(false);
    const [titleErrTxt, setTitleErrTxt] = useState("");
    const [descriptionErrTxt, setDescriptionErrTxt] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());

    const handleShowEditModal = () => {
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };

    //Setting show modal as opposite in UI
    const handleInitFavouriteToggle = () => {
        setInitFavourite(!initFavourite);
    };

    /*
  Sanity check for title 
  */
    const handleTitleChange = (value) => {
        setEventTitle(value);

        if (value.length === 0) {
            setEventTitleIsValid(false);
            setTitleErrTxt("Please enter a title");
        } else {
            setEventTitleIsValid(true);
            setTitleErrTxt("");
        }
    };

    const handleDescriptionChange = (value) => {
        setEventDescription(value);

        if (value.length === 0) {
            setEventDescriptionIsValid(false);
            setDescriptionErrTxt("Please enter a title");
        } else {
            setEventDescriptionIsValid(true);
            setDescriptionErrTxt("");
        }
    };

    const handleDateChange = (event, selectedDate) => {
        setSelectedDate(selectedDate);
    };

    const handleTimeChange = (event, selectedTime) => {
        setSelectedTime(selectedTime);
    };

    //Adding the new event to the DB
    const handleEditEvent = async () => {
        //Create an updated async object locally
        const updatedEvent = {
            title: eventTitle,
            description: eventDescription,
            date: selectedDate.toLocaleDateString(),
            time: selectedTime.toLocaleTimeString(),
            isFavourite: initFavourite,
        };

        //Add to db
        const result = await database.updateEventNew(id, updatedEvent);

        //If successful, add it to list of current events and update state for rerender trigger
        if (result) {
            setEvents((prevEvents) => [
                ...prevEvents,
                { ...updatedEvent, id: result },
            ]);
            setShowEditModal(false);
        } else {
            console.log("Failed to add to db.");
        }

        //TODO add to personal my events list
    };

    //Deleting the pressed event from the DB
    const handleDeleteEvent = async () => {
        const result = await database.deleteEvent(id);

        //If the deletion is successful, removing it from the local state and updating it to trigger a re-render
        if (result) {
            setEvents((prevEvents) =>
                prevEvents.filter((event) => event.id !== id)
            );
            setShowEditModal(false);
            console.log("Event deleted successfully");
        } else {
            console.log("Failed to delete event from the database.");
        }
    };
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

        if (inEditingMode) {
            handleShowEditModal();
        } else if (!inFavouriteMode && !isFavourite) {
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
        } else if (inFavouriteMode && isFavourite) {
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
        <>
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

            <Modal visible={showEditModal} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Add Event</Text>
                    <TextInput
                        style={styles.inputContainer}
                        placeholder="Enter an event title"
                        maxLength={150}
                        onChangeText={handleTitleChange}
                        defaultValue={eventTitle}
                    />
                    <TextInput
                        style={styles.inputContainer}
                        placeholder="Enter an event description"
                        maxLength={150}
                        onChangeText={handleDescriptionChange}
                        defaultValue={eventDescription}
                    />
                    <DateTimePicker
                        value={selectedDate}
                        onChange={handleDateChange}
                    />
                    <DateTimePicker
                        mode="time"
                        value={selectedTime}
                        onChange={handleTimeChange}
                    />
                    <View style={styles.switchContainer}>
                        <Text style={styles.switchText}>
                            Add to favourites?:
                        </Text>
                        <Switch
                            value={initFavourite}
                            onValueChange={handleInitFavouriteToggle}
                        />
                    </View>
                    <Pressable
                        style={styles.modalButton}
                        onPress={handleEditEvent}
                    >
                        <Text style={styles.modalButtonText}>Edit</Text>
                    </Pressable>
                    <Pressable
                        style={styles.modalButton}
                        onPress={handleDeleteEvent}
                    >
                        <Text style={styles.modalButtonText}>Delete</Text>
                    </Pressable>
                    <Pressable
                        style={styles.modalButton}
                        onPress={handleCloseEditModal}
                    >
                        <Text style={styles.modalButtonText}>Close</Text>
                    </Pressable>
                </View>
            </Modal>
        </>
    );
}
