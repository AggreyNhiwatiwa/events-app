/*
Aggrey Nhiwatiwa
1152301
INFO-6132 
Lab 4
*/

// React imports
import { useContext, useEffect, useState } from "react";
import {
    Alert,
    Modal,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// Third party imports
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "react-native-toast-message";
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

    /* State */
    const [showEditModal, setShowEditModal] = useState(false);
    const [initFavourite, setInitFavourite] = useState(false);
    const [eventTitle, setEventTitle] = useState(title);
    const [eventDescription, setEventDescription] = useState(description);
    const [eventTitleIsValid, setEventTitleIsValid] = useState(false);
    const [eventDescriptionIsValid, setEventDescriptionIsValid] =
        useState(false);
    const [titleErrTxt, setTitleErrTxt] = useState("");
    const [descriptionErrTxt, setDescriptionErrTxt] = useState("");
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

    /*
    Formatting date (to a short format) and time in a 12h 
    format just for the UI
    */
    const formattedDate = format(dateAsDate, "MMM dd");
    const [month, day] = formattedDate.split(" ");
    const formattedTime = format(timeAsDate, "hh:mm a");

    /* Side Effects */

    /*
    Whenever the list of favourites or the current event (id) changes, 
    the boolean evaluation on whether it is a favourite or not, using
    a helper function. This triggers the local state to update the UI.
    */

    const isEventFavourited = (eventIdToCheck) => {
        return favouritedEvents.some(
            (favEvent) => favEvent.id === eventIdToCheck
        );
    };

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

    /*
    The event parameter here is a placeholder, as the second argument
    must be a date object per the documentation:
    https://github.com/react-native-datetimepicker/datetimepicker
    */
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
    As the database is the source of truth (SOT), the local state is only
    updates when the update is successful in the database.

    In the success block, myEvents and favourites update their state from the
    database, as the database is the SOT and the async react state updates for 
    the edited event has not completed yet. Therefore this always triggers a rerender 
    with the correct values.
    */
    const handleEditEvent = async () => {
        if (eventTitle.trim() === "" || eventDescription.trim() === "") {
            Alert.alert(
                "Required fields missing",
                `Please ensure all fields are filled out.`,
                [{ text: "OK" }]
            );

            return;
        }

        Alert.alert(
            "Edit Event",
            `Are you sure you want to edit the event "${eventTitle}"?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: async () => {
                        const updatedEvent = {
                            title: eventTitle,
                            description: eventDescription,
                            date: selectedDate.toLocaleDateString(),
                            time: selectedTime.toLocaleTimeString(),
                            isFavourite: initFavourite,
                            authorId: authId,
                        };

                        const success = await database.updateEvent(
                            id,
                            updatedEvent
                        );

                        if (success) {
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

                            const userDocId =
                                await database.getUserDocIdByAuthId(authId);
                            const initialFavouritedEvents =
                                await database.getFavouritesForUser(userDocId);
                            setFavouritedEvents(initialFavouritedEvents);
                            setShowEditModal(false);
                            showSuccessToast("Event edited.");
                        } else {
                            showErrorToast(
                                "Failed to edit event. Please try again."
                            );
                        }
                    },
                },
            ]
        );
    };

    /*
    Removes an event from the global events list.
    Note that as this method is only active in the MyEvents list (which filters events
    made by the current user upon app sign in), so additional write checks are not needed.
    */
    const handleDeleteEvent = async () => {
        Alert.alert(
            "Delete Event",
            `Are you sure you want to delete the event "${eventTitle}"?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: async () => {
                        const result = await database.deleteEvent(id);

                        if (result) {
                            const updatedEvents = events.filter(
                                (event) => event.id !== id
                            );
                            setEvents(updatedEvents);
                            setShowEditModal(false);

                            // Also updating myEvents so that the UI updates
                            const updatedMyEvents = myEvents.filter(
                                (event) => event.id !== id
                            );
                            setMyEvents(updatedMyEvents);
                            setShowEditModal(false);
                            showSuccessToast("Event deleted.");
                        } else {
                            showErrorToast(
                                "Failed to delete event. Please try again."
                            );
                        }
                    },
                },
            ]
        );
    };

    /*
    Event press handler with dynamic events:

        -   If on the Events screen: Pressing an event will show an alert. If the event is already
            in the users favourites a one button alert will inform the user of this. If the event 
            is not a favourite, the user has the option to add it.

        -   If on the Favourites screen: Pressing an event shows an alert which enables a user to 
            unfavourite an Event. 

        -   If on the MyEvents screen: Pressing an event brings up a modal to edit or delete an event.
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
    Adding an event to a users favourites in therefore updating the local state,
    using the database as the source of truth.
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
                showSuccessToast("Event added to favourites.");
            } else {
                showErrorToast(
                    "Failed to add event to favourites. Please try again."
                );
            }
        } catch (error) {
            showErrorToast(
                "Failed to add event to favourites. Please try again."
            );
        }
    };

    /*
    Adding an event to a users favourites in the db before updating the local state,
    using the database as the source of truth.
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
                showSuccessToast("Event removed from favourites.");
            } else {
                showErrorToast(
                    "Failed to remove event from favourites. Please try again."
                );
            }
        } catch (error) {
            showErrorToast(
                "Failed to remove event from favourites. Please try again."
            );
        }
    };

    /* Toast logic */
    const showSuccessToast = (msg) => {
        Toast.show({
            type: "success",
            text1: "Success ✅",
            text2: msg,
            visibilityTime: 2200,
            topOffset: 60,
        });
    };

    const showErrorToast = (errMsg) => {
        Toast.show({
            type: "error",
            text1: "Error 🛑",
            text2: errMsg,
            visibilityTime: 2200,
            topOffset: 60,
        });
    };

    return (
        <>
            <Pressable
                style={styles.container}
                onPress={() => handleEventPress(id)}
            >
                <View style={styles.leftContainer}>
                    <View style={styles.dateBox}>
                        <Text style={styles.dateBoxText}>{month}</Text>
                        <Text style={styles.dateBoxText}>{day}</Text>
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
                    <View style={styles.modalTopContainer}>
                        <TouchableOpacity
                            onPress={handleCloseEditModal}
                            style={{ marginLeft: 15 }}
                        >
                            <MaterialCommunityIcons
                                name="close-box"
                                size={40}
                                color="#1E3F5A"
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.modalTitle}>Edit Event</Text>
                    <View style={styles.modalInputContainer}>
                        <Text style={styles.modalSubtitle}>Title</Text>
                        <TextInput
                            style={styles.inputContainer}
                            placeholder="Enter an event title"
                            maxLength={150}
                            onChangeText={handleTitleChange}
                            value={eventTitle}
                        />
                        <Text style={styles.modalSubtitle}>Description</Text>
                        <TextInput
                            style={styles.inputContainer}
                            placeholder="Enter an event description"
                            maxLength={150}
                            onChangeText={handleDescriptionChange}
                            value={eventDescription}
                        />
                    </View>
                    <Text style={styles.modalSubtitle}>Date</Text>
                    <DateTimePicker
                        value={selectedDate}
                        onChange={handleDateChange}
                        defaultValue={dateAsDate}
                    />
                    <Text style={styles.modalSubtitle}>Time</Text>
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
                        <Text style={styles.modalButtonText}>EDIT</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.modalButton, styles.deleteButton]}
                        onPress={handleDeleteEvent}
                    >
                        <Text style={styles.modalButtonText}>DELETE</Text>
                    </Pressable>
                </View>
            </Modal>
        </>
    );
}
