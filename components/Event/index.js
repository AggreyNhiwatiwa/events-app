/*
Aggrey Nhiwatiwa
1152301
INFO-6132 
Lab 4
*/

// First party imports
import { useContext, useEffect, useState } from "react";
import {
    Alert,
    Modal,
    Pressable,
    Switch,
    Text,
    TextInput,
    View,
} from "react-native";

// Third party imports
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { parse, format } from "date-fns";

// Project imports
import styles from "./styles";
import * as database from "../../database";
import { AuthContext } from "../../context/AuthContext";
import { EventContext } from "../../context/EventContext";

/*
Component that renders an Event item using database data.
The Event item has a dynamic onPress action dependent on where in the app
the item is rendered.
*/

export default function Event({ id, title, description, date, time }) {
    const {
        events,
        setEvents,
        favouritedEvents,
        setFavouritedEvents,
        myEvents,
        setMyEvents,
        inFavouriteMode,
        inEditingMode,
    } = useContext(EventContext);
    const { authId } = useContext(AuthContext);

    //State
    const [showEditModal, setShowEditModal] = useState(false);
    const [initFavourite, setInitFavourite] = useState(false);
    const [eventTitle, setEventTitle] = useState(title);
    const [eventDescription, setEventDescription] = useState(description);
    const [eventTitleIsValid, setEventTitleIsValid] = useState(false);
    const [eventDescriptionIsValid, setEventDescriptionIsValid] =
        useState(false);
    const [titleErrTxt, setTitleErrTxt] = useState("");
    const [descriptionErrTxt, setDescriptionErrTxt] = useState("");
    const [initialDate, setInitialDate] = useState(date);
    const [eventIsFavourited, setEventIsFavourited] = useState(null);

    /*
    Handling date and time

    The issue I encountered is that the DateTimePicker component requires a Date object
    When editing, I want to set the defaultValue of this component to be that of the object
    (as opposed to the current date and time from newDate()).

    The issue is that the passed date and time got converted to a string when it was added to the db
    in the myEvents screen:
    date: date.toLocaleDateString(),
    time: time.toLocaleTimeString(),

    Therefore I need to convert this back to a Date object to meet my goals in a more elegant way than
    having to write a custom formatter

    Therefore I found the following package:
    https://www.npmjs.com/package/date-fns

    Which contains a parse method to dynamically parse strings correctly based on their locale.
    */
    const dateAsDate = parse(date, "dd/MM/yyyy", new Date());
    const timeAsDate = parse(time, "HH:mm:ss", new Date());
    const [selectedDate, setSelectedDate] = useState(dateAsDate);
    const [selectedTime, setSelectedTime] = useState(timeAsDate);

    // Formatted time for the UI
    const formattedDate = format(dateAsDate, "MMM dd");
    const [month, day] = formattedDate.split(' ');

    // Formatting in 12hr format just for UI
    const formattedTime = format(timeAsDate, "hh:mm a");

    /* 
    Helper function which checks whether the current element (from its Id)
    exists in the local list of favourite events
    */
    const isEventFavourited = (eventIdToCheck) => {
        return favouritedEvents.some(
            (favEvent) => favEvent.id === eventIdToCheck
        );
    };

    /*
    Whenever the list of favourites or the current event (id) changes, 
    the boolean evaluation on whether it is a favourite or not from the 
    local state is triggered to update the UI
    */
    useEffect(() => {
        setEventIsFavourited(isEventFavourited(id));
    }, [myEvents, favouritedEvents, id]);

    useEffect(() => {
        setEventIsFavourited(isEventFavourited(id));
        // Also updating myEvents so that the UI updates
        if (authId) {
            const initialMyEvents = events.filter(
                (event) => event.authorId === authId
            );
            setMyEvents(initialMyEvents);
        }
    }, [events]);

    /* Handlers */

    // Add and Edit handlers
    const handleShowEditModal = () => {
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };

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
            setDescriptionErrTxt("Please enter a description");
        } else {
            setEventDescriptionIsValid(true);
            setDescriptionErrTxt("");
        }
    };

    // The event parameter here is a placeholder, as the
    // second argument must be a date object per the documentation
    const handleDateChange = (event, selectedDate) => {
        setSelectedDate(selectedDate);
    };

    const handleTimeChange = (event, selectedTime) => {
        setSelectedTime(selectedTime);
    };

    /* Async Database operations */

    /*
    Creates a local Event object with values from the modal and then 
    updates the currently edited item with these updated values.
    As the database is the source of truth, the local state is only
    updates when the update is successful in the database.
    */
    const handleEditEvent = async () => {
        const updatedEvent = {
            title: eventTitle,
            description: eventDescription,
            date: selectedDate.toLocaleDateString(),
            time: selectedTime.toLocaleTimeString(),
            isFavourite: initFavourite,
            authorId: authId,
        };

        const success = await database.updateEventNew(id, updatedEvent);

        if (success) {
            // Setting myEvents from the db (as the operation is successful), and the events
            // state update above is not yet ready
            const result = await database.getEventsFromDb();

            const dbEvents = result.map((event) => ({
                id: event.id,
                authorId: event.authorId,
                title: event.title,
                description: event.description,
                date: event.date,
                time: event.time,
            }));

            setEvents(dbEvents);

            const updatedMyEvents = dbEvents.filter(
                (event) => event.authorId === authId
            );
            setMyEvents(updatedMyEvents);

            // Also need to trigger a re-render for the favourites, in case a favoruitedevent changes
            // its properties
            const userDocId = await database.getUserDocIdByAuthId(authId);
            const initialFavouritedEvents = await database.getFavouritesForUser(
                userDocId
            );
            setFavouritedEvents(initialFavouritedEvents);

            setShowEditModal(false);
        } else {
            console.log("Failed to add to db.");
        }

        //TODO: add to personal my events list if needed
    };

    /*
    Removes an event from the global events list.
    Note that as this method is only active in the MyEvents list (which filters events
    made by the current user), by design no additional checks are needed for editing/deleting 
    authorisation
    */
    const handleDeleteEvent = async () => {
        const result = await database.deleteEvent(id);

        if (result) {
            const updatedEvents = events.filter((event) => event.id !== id);
            setEvents(updatedEvents);
            setShowEditModal(false);

            // Also updating myEvents so that the UI updates
            const updatedMyEvents = myEvents.filter((event) => event.id !== id);
            setMyEvents(updatedMyEvents);
            setShowEditModal(false);

            console.log("Event deleted successfully");
        } else {
            console.log("Failed to delete event from the database.");
        }
    };
    /*
    Event press handler with dynamic events:

    If on the Events screen: Pressing an event will show an alert. If the event is already
    in the users favourites a one button alert will inform the user of this. If the event 
    is not a favourite, the user has the option to add it.

    If on the Favourites screen: Pressing an event shows an alert which enables a user to 
    unfavourite an Event. 

    If on the MyEvents screen: Pressing an event brings up a modal to edit or delete an event.
    */
    const handleEventPress = () => {
        if (inEditingMode) {
            handleShowEditModal();
            return;
        }

        setEventIsFavourited(isEventFavourited(id));

        if (inFavouriteMode) {
            Alert.alert(
                "Remove from favourites?",
                `Remove the event "${title}" from your favourites?`,
                [
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                    {
                        text: "OK",
                        onPress: () => {
                            handleRemoveFromFavourites();
                        },
                    },
                ]
            );
        } else if (eventIsFavourited && !inFavouriteMode) {
            Alert.alert(
                "Already in favourites",
                `The event "${title}" is already in your favourites.`,
                [{ text: "OK" }]
            );
        } else {
            Alert.alert(
                "Add to favourites?",
                `Add event "${title}" to favourites?`,
                [
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                    {
                        text: "OK",
                        onPress: () => {
                            handleAddToFavourites();
                        },
                    },
                ]
            );
        }
    };

    /*
    Adding an event to a users favourites in thebefore updating the local state, using
    the database as the source of truth.
    */
    const handleAddToFavourites = async () => {
        try {
            const currEvent = await database.getEventById(id);
            const userId = await database.getUserDocIdByAuthId(authId);
            const success = await database.addFavouriteForUser(userId, id);

            if (success) {
                const updatedFavourites = [...favouritedEvents, currEvent];
                setFavouritedEvents(updatedFavourites);
                setEventIsFavourited(true);
                console.log("Event added successfully");
            } else {
                console.error("Failed to add event to favourites.");
            }
        } catch (error) {
            console.error("Error adding event to favourites:", error);
        }
    };

    /*
    Adding an event to a users favourites in the db before updating the local state, using
    the database as the source of truth.
    */
    const handleRemoveFromFavourites = async () => {
        try {
            const userId = await database.getUserDocIdByAuthId(authId);
            const success = await database.removeFavouriteForUser(userId, id);

            if (success) {
                const updatedFavourites = favouritedEvents.filter(
                    (event) => event.id !== id
                );
                setFavouritedEvents(updatedFavourites);
                setEventIsFavourited(false);
                console.log("Event deleted successfully");
            } else {
                console.log("Failed to delete event from the database.");
            }
        } catch (error) {
            console.error("Error adding event to favourites:", error);
        }
    };

    return (
        <>
            <Pressable
                style={styles.container}
                onPress={() => handleEventPress(id)}
            >
                <View style={styles.leftContainer}>
                    <View style={styles.dateBox}>
                    <Text style={styles.subHeading}>{month}</Text>
                    <Text style={styles.subHeading}>{day}</Text>
                    </View>

                </View>

                <View style={styles.centreContainer}>
                    <Text style={styles.mainHeading}>{title}</Text>

                    <Text style={styles.subHeading}>{formattedTime}</Text>
                    <Text style={styles.descriptionHeading}>{description}</Text>
                </View>
                <View style={styles.rightContainer}>
                    <MaterialCommunityIcons
                        name={eventIsFavourited ? "heart" : "heart-outline"}
                        size={30}
                        color="#1E3F5A"
                    />
                </View>
            </Pressable>

            <Modal visible={showEditModal} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Edit Event</Text>
                    <TextInput
                        style={styles.inputContainer}
                        placeholder="Enter an event title"
                        maxLength={150}
                        onChangeText={handleTitleChange}
                        value={eventTitle}
                    />
                    <TextInput
                        style={styles.inputContainer}
                        placeholder="Enter an event description"
                        maxLength={150}
                        onChangeText={handleDescriptionChange}
                        value={eventDescription}
                    />
                    <DateTimePicker
                        value={selectedDate}
                        onChange={handleDateChange}
                        defaultValue={dateAsDate}
                    />
                    <DateTimePicker
                        mode="time"
                        value={selectedTime}
                        onChange={handleTimeChange}
                        defaultValue={timeAsDate}
                    />
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
