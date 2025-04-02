import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
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
            <View style={styles.container}>
                <Text style={styles.title}>{t('welcome')}</Text>
                <Button mode="outlined" style={styles.button} onPress={() => dispatch(setLanguage('en'))} >
                    {t('English')}
                </Button>
                <Button mode="outlined" style={styles.button} onPress={() => dispatch(setLanguage('hi'))}>
                    {t('Hindi')}
                </Button>

                <Button
                    mode="contained"
                    style={styles.nextButton}
                    onPress={async () => {
                        const token = await AsyncStorage.getItem("token"); // Check if user is logged in
                        if (token) {
                            navigation.replace('Home'); // If logged in, go to Home
                        } else {
                            navigation.replace('Login'); // If not logged in, go to Login
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
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
        color: COLORS.lightBlack
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 20,

    },
    button: {
        marginVertical: 10,
        width: 200,
        color: COLORS.primaryColor
    },
    nextButton: {
        marginTop: 30,
        width: 200,
        position: 'absolute',
        bottom: 60,
        color: '#fff',
        backgroundColor: COLORS.primaryColor
    },
});

export default SelectLang;
