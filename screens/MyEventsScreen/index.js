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
    TouchableOpacity,
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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

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
                <TouchableOpacity
                    onPress={handleLogout}
                    style={{ marginLeft: 15 }}
                >
                    <MaterialCommunityIcons
                        name="logout"
                        size={30}
                        color="#FFE733"
                    />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity
                    onPress={handleShowAddModal}
                    style={{ marginRight: 15 }}
                >
                    <MaterialCommunityIcons
                        name="plus"
                        size={30}
                        color="#FFE733"
                    />
                </TouchableOpacity>
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
            const result2 = await database.getEventsFromDb();

            const dbEvents = result2.map((event) => ({
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

            // Also updating the favourite events state in case it was added
            // to the users favourites upon creation
            const updatedFavourites = await database.getFavouritesForUser(
                userId
            );
            setFavouritedEvents(updatedFavourites);

            setShowAddModal(false);
        } else {
            console.log("Failed to add to db.");
        }
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
                    <View style={styles.modalTopContainer}>
                        <TouchableOpacity
                            onPress={handleCloseAddModal}
                            style={{ marginLeft: 15 }}
                        >
                            <MaterialCommunityIcons
                                name="close-box"
                                size={40}
                                color="#1E3F5A"
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.modalTitle}>Add Event</Text>

                    <View style={styles.modalInputContainer}>
                        <Text style={styles.modalSubtitle}>Title</Text>
                        <TextInput
                            style={styles.inputContainer}
                            placeholder="Enter an event title"
                            maxLength={150}
                            onChangeText={handleTitleChange}
                            defaultValue={eventTitle}
                        />
                        <Text style={styles.modalSubtitle}>Description</Text>
                        <TextInput
                            style={styles.inputContainer}
                            placeholder="Enter an event description"
                            maxLength={150}
                            onChangeText={handleDescriptionChange}
                            defaultValue={eventDescription}
                        />
                    </View>

                    <Text style={styles.modalSubtitle}>Date</Text>
                    <DateTimePicker value={date} onChange={handleDateChange} />
                    <Text style={styles.modalSubtitle}>Time</Text>
                    <DateTimePicker
                        mode="time"
                        value={time}
                        onChange={handleTimeChange}
                    />

                    <View style={styles.switchContainer}>
                        <Text style={styles.switchText}>
                            Add to favourites?
                        </Text>
                        <Switch
                            value={initFavourite}
                            onValueChange={handleInitFavouriteToggle}
                            trackColor={{
                                true: "#1E3F5A",
                            }}
                        />
                    </View>
                    <Pressable
                        style={styles.modalButton}
                        onPress={handleAddNewEvent}
                    >
                        <Text style={styles.modalButtonText}>ADD</Text>
                    </Pressable>
                </View>
            </Modal>
        </>
    );
}
