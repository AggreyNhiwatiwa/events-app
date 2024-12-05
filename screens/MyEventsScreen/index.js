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
import Event from "../../components/Event";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as database from "../../database";

//Currently testing with the existing list of items
export default function MyEventsScreen() {
    const { events, setEvents, setInFavouriteMode, setInEditingMode } =
        useContext(EventContext);
    const navigation = useNavigation();

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
            headerRight: () => (
                <Button onPress={handleShowModal} title="Add" color="#FFFFFF" />
            ),
        });
    }, [navigation]);

    /*
  Method to show the add modal
  */
    //Using state to show whether or not a modal should be shown
    //Initially the modal is not shown (set as false)
    const [showModal, setShowModal] = useState(false);
    const [initFavourite, setInitFavourite] = useState(false);
    const [eventTitle, setEventTitle] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventTitleIsValid, setEventTitleIsValid] = useState(false);
    const [eventDescriptionIsValid, setEventDescriptionIsValid] =
        useState(false);
    const [titleErrTxt, setTitleErrTxt] = useState("");
    const [descriptionErrTxt, setDescriptionErrTxt] = useState("");
    const [date, setDate] = useState(new Date()); //Else just init to todays date
    const [time, setTime] = useState(new Date()); //Else just init to todays date

    //Setting show modal as opposite in UI
    const handleModalToggle = () => {
        setShowModal(!showModal);
    };

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
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
        //Create a new event object locally
        const newEvent = {
            title: eventTitle,
            description: eventDescription,
            date: date.toLocaleDateString(),
            time: time.toLocaleTimeString(),
            isFavourite: initFavourite,
        };

        //Add to db
        const result = await database.addEvent(newEvent);
        console.log("Result: ", result);

        //If successful, add it to list of current events and update state for rerender trigger
        if (result) {
            setEvents((prevEvents) => [
                ...prevEvents,
                { ...newEvent, id: result },
            ]);
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
                    data={events}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />
                <View style={styles.infoBar}>
                    <Text style={styles.infoBarText}>
                        Press an event to edit or delete it
                    </Text>
                </View>
            </View>
            <Modal visible={showModal} animationType="slide">
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
                        onPress={handleCloseModal}
                    >
                        <Text style={styles.modalButtonText}>Close</Text>
                    </Pressable>
                </View>
            </Modal>
        </>
    );
}
