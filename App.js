/*
Aggrey Nhiwatiwa
1152301
INFO-6132 
Lab 4
*/

/*
The root component
The data from Firebase is fetched here set to the state declared in the context
This root rendered component is the provider for the EventContext
The navgation container renders the Tabbar (bottom tab navigator)
*/

import { Text } from "react-native";
import TabBar from "./components/TabBar";
import { NavigationContainer } from "@react-navigation/native";
import { EventContext } from "./context/EventContext";
import { useEffect, useState } from "react";
import * as database from "./database";
import { AuthContext } from "./context/AuthContext";
import LoginScreen from "./screens/LoginScreen";
import Toast from 'react-native-toast-message';

export default function App() {
    const [events, setEvents] = useState([]);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [myEvents, setMyEvents] = useState([]);
    const [favouritedEvents, setFavouritedEvents] = useState([]);
    const [inFavouriteMode, setInFavouriteMode] = useState(false);
    const [inEditingMode, setInEditingMode] = useState(false);

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authId, setAuthId] = useState(null);
    const [userId, setUserId] = useState(null);
  
    useEffect(() => {
      async function loadAllEvents() {
          try {
              // Getting the events from the db and setting to local state
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
  
              // Getting events made by currently logged in user and setting to state
              if (authId) {
                  const initialMyEvents = dbEvents.filter(
                      (event) => event.authorId === authId
                  );
                  setMyEvents(initialMyEvents);
              }

              // Using helper to get userId
              const userDocId = await database.getUserDocIdByAuthId(authId);
  
              // Getting favourited events for the current user and setting to state
              const initialFavouritedEvents = await database.getFavouritesForUser(userDocId);
              setFavouritedEvents(initialFavouritedEvents);
          } catch (error) {
              console.error("Error loading data from the db:", error);
          }
      }
  
      loadAllEvents();
  }, [authId]); 

    if (events === null) {
        return <Text>Please wait</Text>;
    }

    return (
        <>
        <AuthContext.Provider
            value={{
                isAuthenticated,
                setIsAuthenticated,
                authId,
                setAuthId,
            }}
        >
            <EventContext.Provider
                value={{
                    events,
                    setEvents,
                    currentEvent,
                    setCurrentEvent,
                    myEvents,
                    setMyEvents,
                    favouritedEvents,
                    setFavouritedEvents,
                    inFavouriteMode,
                    setInFavouriteMode,
                    inEditingMode,
                    setInEditingMode,
                }}
            >
                <NavigationContainer>
                    {isAuthenticated ? <TabBar></TabBar> : <LoginScreen />}
                </NavigationContainer>
            </EventContext.Provider>
        </AuthContext.Provider>
        <Toast />
        </>
    );
}
