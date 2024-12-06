/*
Aggrey Nhiwatiwa
1152301
INFO-6132 
Lab 4
*/

/*
Simply renders the list of events created by the currently logged in user.

When an Event in this list is pressed, it allows it to be edited (this logic is handled in the Event component)
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

//Currently testing with the existing list of items
export default function MyEventsScreen() {
    const {
        events,
        setEvents,
        setInFavouriteMode,
        setInEditingMode,
        myEvents,
        setMyEvents,
    } = useContext(EventContext);
    const navigation = useNavigation();

    const { isAuthenticated, setIsAuthenticated, authId, setAuthId } =
        useContext(AuthContext);

    /*
  useFocusEffect hook to ensure that whenever the Events screen is navigated to, the
  global boolean for inBorrowingMode is set to false
  */
    useFocusEffect(
        useCallback(() => {
            setInEditingMode(true);
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

            //resetting state
            setIsAuthenticated(false);
            setAuthId(null);
            console.log("Successfully signed out");

        })
        .catch(() => {
            console.log("Error signing users out");
        });
    };



    /*
  Method to show the add modal
  */
    //Using state to show whether or not a modal should be shown
    //Initially the modal is not shown (set as false)
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

    //Adding the new event to the DB
    const handleAddNewEvent = async () => {
        //Create a new event object locally, gets authorId from global context
        const newEvent = {
            title: eventTitle,
            description: eventDescription,
            date: date.toLocaleDateString(),
            time: time.toLocaleTimeString(),
            isFavourite: initFavourite,
            authorId: authId,
        };

        //Add to db
        const result = await database.addEvent(newEvent);
        console.log("Result: ", result);

        //If successful, add it to list of current events and update state for rerender trigger
        if (result) {
            setMyEvents((prevEvents) => [
                ...prevEvents,
                { ...newEvent, id: result },
            ]);
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
