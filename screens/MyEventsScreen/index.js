/*
Aggrey Nhiwatiwa
1152301
INFO-6132 
Lab 4
*/

/*
Simply renders the list of events created by the currently logged in user.

When an Event in this list is pressed, it allows it to be edited (this logic is handled in the Event component)

The modal here is for adding and event, while the modal defined in Event is for editing a component
*/

import {
    Button,
    FlatList,
    Modal,
    Pressable,
    Switch,
    Text,
    TextInput,
    View,
} from "react-native";
import { useCallback, useContext, useEffect } from "react";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { EventContext } from "../../context/EventContext";
import { AuthContext } from "../../context/AuthContext";
import Event from "../../components/Event";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as database from "../../database";

import { signOut } from "firebase/auth";
import { auth } from "../../database/config";

export default function MyEventsScreen() {
    const {
        events,
        setEvents,
        setInFavouriteMode,
        setInEditingMode,
        myEvents,
        setMyEvents,
        setFavouritedEvents,
    } = useContext(EventContext);
    const navigation = useNavigation();

    const { isAuthenticated, setIsAuthenticated, authId, setAuthId } =
        useContext(AuthContext);

    /*
    useFocusEffect hook to ensure that whenever MyScreen is navigated to, the
    global boolean for inEditingMode is set to true, as only the event author can
    edit or delete posts authored by themselves. This allows event UI items to have
    favourite specific onPress actions.
    */
    useFocusEffect(
        useCallback(() => {
            setInEditingMode(true);
            setInFavouriteMode(false);
        }, [])
    );

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Button
                    onPress={handleLogout}
                    title="Log Out"
                    color="#FFFFFF"
                />
            ),
            headerRight: () => (
                <Button
                    onPress={handleShowAddModal}
                    title="Add"
                    color="#FFFFFF"
                />
            ),
        });
    }, [navigation]);

    //TODO: Add success/err toasts here
    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                //resetting states
                setIsAuthenticated(false);
                setAuthId(null);
                setFavouritedEvents([]);
                setMyEvents([]);
                console.log("Successfully signed out");
            })
            .catch(() => {
                console.log("Error signing users out");
            });
    };

    const [showAddModal, setShowAddModal] = useState(false);
    const [initFavourite, setInitFavourite] = useState(false);
    const [eventTitle, setEventTitle] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventTitleIsValid, setEventTitleIsValid] = useState(false);
    const [eventDescriptionIsValid, setEventDescriptionIsValid] =
        useState(false);
    const [titleErrTxt, setTitleErrTxt] = useState("");
    const [descriptionErrTxt, setDescriptionErrTxt] = useState("");
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());

    const handleShowAddModal = () => {
        setShowAddModal(true);
    };

    const handleCloseAddModal = () => {
        setShowAddModal(false);
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
        setDate(selectedDate);
    };

    const handleTimeChange = (event, selectedTime) => {
        setTime(selectedTime);
    };

    /*
    Adding the new event to the DB
    Gets authorId from global context
    */
    const handleAddNewEvent = async () => {
        const newEvent = {
            title: eventTitle,
            description: eventDescription,
            date: date.toLocaleDateString(),
            time: time.toLocaleTimeString(),
            isFavourite: initFavourite,
            authorId: authId,
        };
        const userId = await database.getUserDocIdByAuthId(authId);
        const result = await database.addEvent(newEvent, userId);

        if (result) {
            const newEventWithId = { ...newEvent, id: result };
            const updatedEvents = [...myEvents, newEventWithId];
            setMyEvents(updatedEvents);


            // Also updating the favourite events state in case it was added
            // to the users favourites upon creation
            const updatedFavourites = await database.getFavouritesForUser(userId);
            setFavouritedEvents(updatedFavourites);

            setShowAddModal(false);
        } else {
            console.log("Failed to add to db.");
        }

        //TODO add to personal my events list
    };

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
                    data={myEvents}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />
                <View style={styles.infoBar}>
                    <Text style={styles.infoBarText}>
                        Press an event to edit or delete it
                    </Text>
                </View>
            </View>
            <Modal visible={showAddModal} animationType="slide">
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
                    <DateTimePicker value={date} onChange={handleDateChange} />
                    <DateTimePicker
                        mode="time"
                        value={time}
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
                        onPress={handleAddNewEvent}
                    >
                        <Text style={styles.modalButtonText}>Add</Text>
                    </Pressable>
                    <Pressable
                        style={styles.modalButton}
                        onPress={handleCloseAddModal}
                    >
                        <Text style={styles.modalButtonText}>Close</Text>
                    </Pressable>
                </View>
            </Modal>
        </>
    );
}
