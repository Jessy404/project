import React, { useState, useCallback, useEffect } from "react";
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ImageBackground, KeyboardAvoidingView, Platform,
    ToastAndroid, Switch
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../config/firebaseConfig"
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore";
import { userDetailContext } from "./../../context/userDetailContext"
import { useContext } from 'react';
import { ActivityIndicator } from "react-native-paper";
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const { userDetail, setUserDetail } = useContext(userDetailContext);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const loadRememberedCredentials = async () => {
            try {
                const savedEmail = await AsyncStorage.getItem('rememberedEmail');
                const savedPassword = await AsyncStorage.getItem('rememberedPassword');
                const rememberMeStatus = await AsyncStorage.getItem('rememberMe');

                if (savedEmail && savedPassword && rememberMeStatus === 'true') {
                    setEmail(savedEmail);
                    setPassword(savedPassword);
                    setRememberMe(true);
                }
            } catch (error) {
                console.error('Error loading remembered credentials:', error);
            } finally {
                setInitializing(false);
            }
        };

        loadRememberedCredentials();
    }, []);

    const onSignInClick = async () => {
        setLoading(true);
    
        try {
            if (rememberMe) {
                await AsyncStorage.setItem('rememberedEmail', email);
                await AsyncStorage.setItem('rememberedPassword', password);
                await AsyncStorage.setItem('rememberMe', 'true');
            } else {
                await AsyncStorage.removeItem('rememberedEmail');
                await AsyncStorage.removeItem('rememberedPassword');
                await AsyncStorage.removeItem('rememberMe');
            }
    
            // Sign in with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log(user);
    
            await getUserDetail();
            router.replace('/(tabs)/home');
        } catch (error) {
            console.log(error);
            if (Platform.OS === 'android') {
                ToastAndroid.show('Incorrect Email or Password', ToastAndroid.BOTTOM);
            } else {
                Alert.alert('Error', 'Incorrect Email or Password');
            }
        } finally {
            setLoading(false);
        }
    };
    

    const getUserDetail = async () => {
        const result = await getDoc(doc(db, "users", email));
        if (result.exists()) {
            console.log(result.data());
            setUserDetail(result.data());
        } else {
            console.log("No such document!");
        }
    };

    if (initializing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#062654" />
            </View>
        );
//router.push("/(tabs)/home")    
    }

    return (
        <ImageBackground source={require("../../assets/images/blue.jpeg")} style={styles.background}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                <Text style={styles.title}>Welcome Back</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    placeholderTextColor="#aaa"
                    value={email}
                    onChangeText={(value) => setEmail(value)}
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    placeholderTextColor="#aaa"
                    value={password}
                    onChangeText={(value) => setPassword(value)}
                    autoCapitalize="none"
                />

                <View style={styles.options}>
                    <View style={styles.rememberMeContainer}>
                        <Switch
                            value={rememberMe}
                            onValueChange={setRememberMe}
                            trackColor={{ false: "#767577", true: "#062654" }}
                            thumbColor={rememberMe ? "#f4f3f4" : "#f4f3f4"}
                        />
                        <Text style={styles.rememberText}>Remember me</Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.forgotText}>Forgot password?</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={onSignInClick}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.buttonText}>Sign In</Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.orText}>Or sign in with</Text>
                <View style={styles.socialIcons}>
                    <Ionicons name="logo-facebook" size={28} color="#3b5998" />
                    <Ionicons name="logo-google" size={28} color="#db4437" />
                </View>

                <TouchableOpacity onPress={() => router.replace("../Account/register")}>
                    <Text style={styles.signupText}>
                        Don't have an account? <Text style={styles.boldText}>Sign up</Text>
                    </Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </ImageBackground>
    );

}
const styles = StyleSheet.create({

    background: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        resizeMode: "cover",
    },
    container: {
        width: "90%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 40,
        alignItems: "center",
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    backButton: {
        position: "absolute",
        top: 20,
        left: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#062654",
        marginBottom: 30,
    },
    input: {
        width: "100%",
        padding: 15,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 25,
        backgroundColor: "#f9f9f9",
        marginBottom: 10,
        shadowColor: "#999",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    options: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 15,
        alignItems: "center",
    },
    rememberMeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    rememberText: {
        color: "#aaa",
        marginLeft: 8,
    },
    forgotText: {
        color: "#062654",
        fontWeight: "bold",
    },
    button: {
        backgroundColor: "#062654",
        padding: 15,
        borderRadius: 25,
        width: "100%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    orText: {
        marginVertical: 15,
        color: "#777",
    },
    socialIcons: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "60%",
        marginBottom: 15,
    },
    signupText: {
        color: "#777",
        marginTop: 10,
    },
    boldText: {
        fontWeight: "bold",
        color: "#062654",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
});
