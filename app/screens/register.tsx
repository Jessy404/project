import React, { useState,useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {auth, db} from "../../config/firebaseConfig"
import {createUserWithEmailAndPassword, browserSessionPersistence , sendPasswordResetEmail,signInWithCredential, GoogleAuthProvider} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {userDetailContext} from "./../../context/userDetailContext"
import { useContext } from 'react';
import { Alert } from "react-native";
import * as AuthSession from "expo-auth-session";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
export default function RegisterScreen() {
   const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const {userDetail ,setUserDetail} =useContext(userDetailContext);
  // const handleRegister = () => {
  //   router.replace("/(tabs)/home");
  // };
    WebBrowser.maybeCompleteAuthSession();

  const createNewAccount = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (resp) => {
        const user = resp.user;

        console.log("User created:", user);
        await saveUser(user, name);  
        Alert.alert("Success", "New account was created successfully");

      })
      .catch((e) => {
        console.log("Error:", e.message);
        Alert.alert("Error", e.message);
      });
  };
  
  const [request, response, promptAsync] = Google.useAuthRequest({
          expoClientId: "1042740888608-5j1fklmvlev4vitrhot1bcr8nlm1h9sq.apps.googleusercontent.com",
          androidClientId: "1042740888608-dc7fef2ol3lma2q4k1ni8j1mrmg7nf55.apps.googleusercontent.com",
          webClientId: "1042740888608-5am9h15ckoag6jrftc1q9kvmv7prjl0c.apps.googleusercontent.com",
          redirectUri: "https://auth.expo.io/@aya21/project",
      });
      
  // const saveUser = async (user: /unresolved/ any ) => {
  //   await setDoc(doc(db, "users", user.uid), {
  //     name: user.fullName,
  //     email: user.email,
  //     member: false,
  //     uid: user.uid
  //   });
  // };
  const saveUser = async (user:  any, fullName: string) => {

    try {
      console.log("Saving user to Firestore:", {
        name: fullName,
        email: user.email,
        member: false,
        uid: user.uid
      });
  
      
      await setDoc(doc(db, "users", user.uid), {
        name: fullName,
        email: user.email,
        member: false,
        uid: user.uid
      });
  
      console.log("User saved successfully.");
    } catch (e) {
      console.log("Error saving user:");
    }

    // setUserDetail({

    // })
  };
   useEffect(() => {
          if (response?.type === "success") {
              const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
           
  
            signInWithCredential(auth, credential)
              .then(() => {
                router.push('/(tabs)/home');
              })
              .catch((error) => {
                Alert.alert("Login error", error.message);
              });
          }
        }, [response]);
  return (
    <ImageBackground source={require("../../assets/images/blue.jpeg")} style={styles.background}>
       <KeyboardAvoidingView 
              behavior={Platform.OS === "ios" ? "padding" : "height"} 
              style={styles.container}
            >
     
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={24} color="white" />
</TouchableOpacity>



     
        <Text style={styles.title}>Create an Account</Text>

        <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={(value)=>setName(value)} />
        <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={email} onChangeText={(value)=>setEmail(value)} />
        <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" value={phone} onChangeText={(value)=>setPhone(value)} />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={(value)=>setPassword(value)} />

        <TouchableOpacity style={styles.button} onPress={createNewAccount}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Or Sign up with</Text>
        <View style={styles.socialIcons}>
          <Ionicons name="logo-facebook" size={28} color="#3b5998" />
           <TouchableOpacity onPress={() => promptAsync()}> <Ionicons name="logo-google" size={28} color="#db4437" /> </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push("/Account/signin")}>
          <Text style={styles.signinText}>
            Already have an account? <Text style={{ fontWeight: "bold", color: "#062654" }}>Sign in</Text>
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
  backButton: {
    
    position: "absolute",
    top: 50,
    left: 20,
    
  },
  backText: {
    color: "white",
    fontSize: 22, 
    fontWeight: "bold",
    marginLeft: 5, 
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
  title: {
    fontSize: 26,
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
    width: "80%",
    marginBottom: 15,
    marginTop: 10,
  },
  signinText: {
    color: "#777",
    marginTop: 15,
  },
});
