import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text, ActivityIndicator } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { clearTicketMessage, createHelpSupportTicket } from "../redux/slices/adminSlice";
import { COLORS } from "../../theme";


const HelpSupportScreen = () => {

    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const dispatch = useDispatch();
    const { ticketStatus, ticketMessage } = useSelector((state) => state.adminData);

    // Inside your component
    useEffect(() => {
        if (ticketMessage) {
            const timer = setTimeout(() => {
                dispatch(clearTicketMessage());
            }, 5000); // 5 seconds

            return () => clearTimeout(timer); // cleanup
        }
    }, [ticketMessage, dispatch]);


    const handleSubmit = () => {
        if (!subject.trim() || !message.trim()) {
            Alert.alert("Validation", "Please enter both subject and message.");
            return;
        }
        dispatch(createHelpSupportTicket({ subject, message }));
        setSubject("");
        setMessage("");
    };

    return (

        <View style={styles.container}>

            <Text style={styles.heading}>Raise a Help & Support Ticket</Text>

            <TextInput
                label="Subject"
                value={subject}
                onChangeText={setSubject}
                mode="outlined"
                style={styles.input}
            />

            <TextInput
                label="Message"
                value={message}
                onChangeText={setMessage}
                mode="outlined"
                multiline
                numberOfLines={4}
                style={styles.input}
            />

            {ticketStatus === "loading" ? (
                <ActivityIndicator color={COLORS.primaryColor} />
            ) : (
                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.button}
                >
                    Submit Ticket
                </Button>
            )}

            {ticketMessage && (
                <Text style={styles.statusText}>{ticketMessage}</Text>
            )}
            
        </View>

    );

};

export default HelpSupportScreen;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#fff",
        flex: 1,
    },
    heading: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
        color: COLORS.primaryColor,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        backgroundColor: COLORS.primaryColor,
        marginTop: 10,
        padding: 5,
        borderRadius: 4,
        fontSize: 14,
    },
    statusText: {
        marginTop: 20,
        fontSize: 14,
        color: COLORS.secondaryColor,
        textAlign: "center",
        textTransform: "capitalize",
        letterSpacing: 0.5,
        borderWidth: 1,
        borderColor: COLORS.secondaryColor,
        padding: 20,
        fontWeight: "bold",
        lineHeight: 22
    },
});
