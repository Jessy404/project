import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
// import { router } from "expo-router";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {auth, db} from "../../config/firebaseConfig"
import {createUserWithEmailAndPassword} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {userDetailContext} from "./../../context/userDetailContext"
import { useContext } from 'react';
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

  const createNewAccount = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (resp) => {
        const user = resp.user;
        console.log("User created:",user);
        await saveUser(user ,name); 
      })
      .catch((e) => {
        console.log("Error:" , e.message);
      });
  };
  
  // const saveUser = async (user: /*unresolved*/ any ) => {
  //   await setDoc(doc(db, "users", user.uid), {
  //     name: user.fullName,
  //     email: user.email,
  //     member: false,
  //     uid: user.uid
  //   });
  // };
  const saveUser = async (user: /*unresolved*/ any, fullName: string) => {

    try {
      console.log("Saving user to Firestore:", {
        name: fullName,
        email: user.email,
        member: false,
        uid: user.uid
      });
  
      // كتابة البيانات في Firestore
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
  
  return (
    <ImageBackground source={require("../../assets/images/login-background.jpeg")} style={styles.background}>
      
    
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
  <Text style={styles.backText}>{"<"} Back</Text>
</TouchableOpacity>



      <View style={styles.container}>
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
          <Ionicons name="logo-google" size={28} color="#db4437" />
        </View>

        <TouchableOpacity onPress={() => router.push("/Account/signin")}>
          <Text style={styles.signinText}>
            Already have an account? <Text style={{ fontWeight: "bold", color: "#062654" }}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    resizeMode: "cover",
    paddingTop: 50,
  },
  backButton: {
    flexDirection: "row", 
    alignItems: "center",
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backText: {
    color: "white",
    fontSize: 22, 
    fontWeight: "bold",
    marginLeft: 5, 
  },
  
  container: {
    width: "100%",
    height: "85%",
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: "center",
    elevation: 10,
    position: "absolute",
    bottom: 0,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#062654",
    marginBottom: 30,
    marginTop: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    elevation: 3,
  },
  button: {
    backgroundColor: "#062654",
    padding: 15,
    marginTop: 30,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    elevation: 8,
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
    marginTop: 15,
  },
});

