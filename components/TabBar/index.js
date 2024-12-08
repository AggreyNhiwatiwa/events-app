/*
Aggrey Nhiwatiwa
1152301
INFO-6132 
Lab 4
*/

/*
The component that renders the bottom tab bar.
*/

// React imports
import { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Third party imports
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Project imports
import { EventContext } from "../../context/EventContext";
import styles from "./styles";
import FavouriteEventsScreen from "../../screens/FavouriteEventsScreen";
import MyEventsScreen from "../../screens/MyEventsScreen";
import AllEventsScreen from "../../screens/AllEventsScreen";

const Tab = createBottomTabNavigator();

export default function TabBar() {
    const { favouritedEvents, myEvents, events } = useContext(EventContext);

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: styles.tabbar,
                headerShown: false,
                tabBarLabelStyle: { fontSize: 12 },
            }}
        >
            <Tab.Screen
                name="AllEventsScreen"
                component={AllEventsScreen}
                options={() => ({
                    title: "Events",
                    headerTitle: `Events (${events.length})`,
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: "#1E3F5A",
                    },
                    headerTintColor: "#FFFFFF",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    tabBarActiveTintColor: "#FFE733",
                    tabBarInactiveTintColor: "#FFFFFF",
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name={"calendar-month"}
                            color={color}
                            size={30}
                        />
                    ),
                })}
            ></Tab.Screen>

            <Tab.Screen
                name="MyEventsScreen"
                component={MyEventsScreen}
                options={() => ({
                    title: "My Events",
                    headerTitle: `My Events (${myEvents.length})`,
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: "#1E3F5A",
                    },
                    headerTintColor: "#FFFFFF",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    tabBarActiveTintColor: "#FFE733",
                    tabBarInactiveTintColor: "#FFFFFF",
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name={"calendar-account"}
                            color={color}
                            size={30}
                        />
                    ),
                })}
            ></Tab.Screen>

            <Tab.Screen
                name="FavouriteEventsScreen"
                component={FavouriteEventsScreen}
                options={() => ({
                    title: "Favourites",
                    headerTitle: `Favourites (${favouritedEvents.length})`,
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: "#1E3F5A",
                    },
                    headerTintColor: "#FFFFFF",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    tabBarActiveTintColor: "#FFE733",
                    tabBarInactiveTintColor: "#FFFFFF",
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name={"calendar-heart"}
                            color={color}
                            size={30}
                        />
                    ),
                })}
            ></Tab.Screen>
        </Tab.Navigator>
    );
}
