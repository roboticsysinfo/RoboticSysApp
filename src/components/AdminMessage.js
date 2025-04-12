import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminMessages } from "../redux/slices/adminSlice";
import { ScrollView, StyleSheet, View } from "react-native";
import { COLORS } from "../../theme";
import { Text } from "react-native-gesture-handler";
import { ActivityIndicator, Divider } from "react-native-paper";

const AdminMessagesScreen = () => {

    const dispatch = useDispatch();
    const { messages, status, error } = useSelector(state => state.adminData);

    useEffect(() => {
        dispatch(fetchAdminMessages());
    }, [dispatch]);

    if (status === "loading") return <ActivityIndicator size="small" color={COLORS.primaryColor} />;
    if (status === "failed") return <Text>Error: {error?.message || JSON.stringify(error)}</Text>;

    return (

        <View style={{ padding: 0 }}>

            {messages.length === 0 ? (
                <Text style={styles.noMessage}></Text>
            ) : (
                messages.map(msg => (
                    <View key={msg._id}>

                        {/* Badge */}
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Important Message</Text>
                        </View>

                        {/* Message Card */}
                        <View style={styles.messageContainer}>
                            <Text style={styles.title}>{msg.title}</Text>
                            <Text style={styles.message}>{msg.message}</Text>
                            {/* <Text style={styles.time}>
                                {new Date(msg.createdAt).toLocaleString()}
                            </Text> */}
                        </View>

                    </View>
                ))
            )}

            <Divider style={{ borderWidth: 1, borderColor: "#efefef", marginVertical: 10 }} />

        </View>

    );

};

export default AdminMessagesScreen

const styles = StyleSheet.create({

    messageContainer: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#efefef",
        marginBottom: 10,
        padding: 16,
        width: "100%",
        elevation: 3
    },

    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333"
    },

    // Description (Message) Styling
    message: {
        fontSize: 14,
        color: "#666",
        marginTop: 10,
        lineHeight: 20
    },

    // Time Styling
    time: {
        fontSize: 12,
        color: "gray"
    },

    noMessage: {
        textAlign: "center",
        fontSize: 16,
        color: "gray",
        marginTop: 40,
    },

    badge: {
        backgroundColor: "#FFD700", // dark yellow
        alignSelf: "flex-start",
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginBottom: 4,
        elevation: 2,
    },

    badgeText: {
        color: "#000", // black text
        fontSize: 12,
        fontWeight: "bold",
        textTransform: "uppercase"
    },


});