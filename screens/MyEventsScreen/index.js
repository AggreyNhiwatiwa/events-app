/*
Aggrey Nhiwatiwa
1152301
INFO-6132 
Lab 4
*/

// React imports
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import {
    Alert,
    FlatList,
    Modal,
    Pressable,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// Third party imports
import { signOut } from "firebase/auth";
import DateTimePicker from "@react-native-community/datetimepicker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "react-native-toast-message";

// Project imports
import styles from "./styles";
import { EventContext } from "../../context/EventContext";
import { AuthContext } from "../../context/AuthContext";
import Event from "../../components/Event";
import * as database from "../../database";
import { auth } from "../../database/config";

/*
Simply renders the list of events created by the currently logged in user.
When an Event in this list is pressed, it allows it to be edited (this logic is handled in the Event component)
The modal here is for adding and events, while the modal defined in Event is for editing a component.
useFocusEffect helps update the global state to ensure each event
item has its correct onPress action
*/
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

    /* State */
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
    const { setIsAuthenticated, authId, setAuthId } = useContext(AuthContext);

    /* Side effects */
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

    // Ensures the add modal is empty in the state
    useEffect(() => {
        setEventTitle("");
        setEventDescription("");
    }, [showAddModal]);

    useFocusEffect(
        useCallback(() => {
            setEventTitle("");
            setEventDescription("");
        }, [])
    );

    /* Handlers */
    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                //resetting states
                setIsAuthenticated(false);
                setAuthId(null);
                setFavouritedEvents([]);
                setMyEvents([]);
            })
            .catch(() => {
                showErrorToast("Error signing out. Please try again.");
            });
    };

    const handleShowAddModal = () => {
        setShowAddModal(true);
    };

    const handleCloseAddModal = () => {
        setShowAddModal(false);
    };

    const handleInitFavouriteToggle = () => {
        setInitFavourite(!initFavourite);
    };

    const handleDateChange = (event, selectedDate) => {
        setDate(selectedDate);
    };

    const handleTimeChange = (event, selectedTime) => {
        setTime(selectedTime);
    };

    /* Sanity checks */
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

    /*
    When add is pressed, there is input validation to make sure that
    all fields have been set.
    If so, this is created in the db.
    */
    const handleAddNewEvent = async () => {
        if (eventTitle.trim() === "" || eventDescription.trim() === "") {
            Alert.alert(
                "Required fields missing",
                `Please ensure all fields are filled out.`,
                [{ text: "OK" }]
            );

            return;
        }

        Alert.alert(
            "Add Event",
            `Are you sure you want to add the event "${eventTitle}"?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: async () => {
                        const newEvent = {
                            title: eventTitle,
                            description: eventDescription,
                            date: date.toLocaleDateString(),
                            time: time.toLocaleTimeString(),
                            isFavourite: initFavourite,
                            authorId: authId,
                        };
                        const userId = await database.getUserDocIdByAuthId(
                            authId
                        );
                        const result = await database.addEvent(
                            newEvent,
                            userId
                        );

                        if (result) {
                            const newResult = await database.getEventsFromDb();

                            const dbEvents = newResult.map((event) => ({
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

                            const updatedFavourites =
                                await database.getFavouritesForUser(userId);
                            setFavouritedEvents(updatedFavourites);
                            setShowAddModal(false);
                            showSuccessToast("Event added.");
                        } else {
                            showErrorToast(
                                "Failed to add event. Please try again."
                            );
                        }
                    },
                },
            ]
        );
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
                        <Text style={styles.modalButtonText}>Add</Text>
                    </Pressable>
                </View>
            </Modal>
        </>
    );
}
