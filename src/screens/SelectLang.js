import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import '../../config/i18n';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../redux/slices/languageSlice';
import { COLORS } from '../../theme';


const SelectLang = () => {

    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const language = useSelector((state) => state.language.language);

    // update language
    useEffect(() => {
        i18n.changeLanguage(language);
    }, [language]);


    return (
        <>
            {/* Fixed "Go to Home" at the top */}
            <View style={styles.topRightWrapper}>
                <Text style={styles.goHomeText} onPress={() => navigation.replace('Dashboard')}>
                    Go to Home
                </Text>
            </View>

            {/* Main container with scrollable content between Go to Home and Next button */}
            <View style={styles.container}>

                <Text style={styles.title}>{t('welcome')}</Text>

                {/* Scrollable View for buttons */}
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >

                    <Button style={styles.button}
                        labelStyle={{ fontSize: 16, textAlign: 'center', flexWrap: 'wrap' }}
                        onPress={() => dispatch(setLanguage('en'))}>
                        {t('English')}
                    </Button>
                    
                    <Button style={styles.button}
                        labelStyle={{ fontSize: 16, textAlign: 'center', flexWrap: 'wrap' }}
                        onPress={() => dispatch(setLanguage('hi'))}>
                        {`${t('Hindi')} / hindi`}
                    </Button>

                    <Button style={styles.button}
                        labelStyle={{ fontSize: 16, textAlign: 'center', flexWrap: 'wrap' }}
                        onPress={() => dispatch(setLanguage('pa'))}>
                        {`${t('Punjabi')} / punjabi`}
                    </Button>

                    <Button style={styles.button}
                        labelStyle={{ fontSize: 16, textAlign: 'center', flexWrap: 'wrap' }}
                        onPress={() => dispatch(setLanguage('ur'))}>
                        {`${t('Urdu')} / urdu`}
                    </Button>

                    <Button style={styles.button}
                        labelStyle={{ fontSize: 16, textAlign: 'center', flexWrap: 'wrap' }}
                        onPress={() => dispatch(setLanguage('mr'))}>
                        {`${t('Marathi')} / marathi`}
                    </Button>

                    <Button style={styles.button}
                        labelStyle={{ fontSize: 16, textAlign: 'center', flexWrap: 'wrap' }}
                        onPress={() => dispatch(setLanguage('gu'))}>
                        {`${t('Gujarati')} / gujarati`}
                    </Button>

                    <Button style={styles.button}
                        labelStyle={{ fontSize: 16, textAlign: 'center', flexWrap: 'wrap' }}
                        onPress={() => dispatch(setLanguage('te'))}>
                        {`${t('Telugu')} / telugu`}
                    </Button>

                    <Button style={styles.button}
                        labelStyle={{ fontSize: 16, textAlign: 'center', flexWrap: 'wrap' }}
                        onPress={() => dispatch(setLanguage('ta'))}>
                        {`${t('Tamil')} / tamil`}
                    </Button>

                    <Button style={styles.button}
                        labelStyle={{ fontSize: 16, textAlign: 'center', flexWrap: 'wrap' }}
                        onPress={() => dispatch(setLanguage('bn'))}>
                        {`${t('Bengali')} / bengali`}
                    </Button>

                    <Button
                        contentStyle={{ flexWrap: 'wrap' }}
                        style={styles.button}
                        labelStyle={{ fontSize: 16, textAlign: 'center', flexWrap: 'wrap' }}
                        onPress={() => dispatch(setLanguage('kn'))}>
                        {`${t('Kannada')} / kannada`}
                    </Button>

                    <Button style={styles.button}
                        labelStyle={{ fontSize: 16, textAlign: 'center', flexWrap: 'wrap' }}
                        onPress={() => dispatch(setLanguage('or'))}>
                        {`${t('Odia')} / odia`}
                    </Button>

                </ScrollView>

                {/* Fixed "Next" button at the bottom */}
                <Button
                    mode="contained"
                    style={styles.nextButton}
                    onPress={async () => {
                        const token = await AsyncStorage.getItem("token");
                        if (token) {
                            navigation.replace('Dashboard');
                        } else {
                            navigation.replace('Login');
                        }
                    }}
                >
                    {t('Next')}
                </Button>
            </View>
        </>
    );


};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        paddingBottom: 100, // Allow space for the Next button
    },

    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
        color: COLORS.lightBlack,
    },

    button: {
        fontSize: 16,
        marginVertical: 10,
        width: "100%", // Set a dynamic width to avoid overflow
        maxWidth: 300,
        color: COLORS.primaryColor,
        paddingHorizontal: 10,
        justifyContent: 'center',
        textTransform: "capitalize",
        borderWidth: 1,
        borderColor: COLORS.primaryColor
    },

    nextButton: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        paddingVertical: 10,
        backgroundColor: COLORS.primaryColor,
        color: '#fff',
        borderRadius: 4
    },

    topRightWrapper: {
        backgroundColor: "#fff",
        paddingTop: 20,
        marginLeft: "auto",
        width: "100%",
    },

    goHomeText: {
        color: COLORS.primaryColor,
        fontSize: 16,
        fontWeight: '700',
        textDecorationLine: "underline",
        marginRight: "auto",
        left: "65%"

    },

    scrollContainer: {
        paddingBottom: 100, // Ensure space for Next button
        alignItems: 'center',
        marginTop: 20
    },
});


export default SelectLang;