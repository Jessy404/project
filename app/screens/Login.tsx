import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ImageBackground source={require("../../assets/images/login-background.jpeg")} style={styles.background}>

      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.title}>Welcome back</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.options}>
          <TouchableOpacity>
            <Text style={styles.rememberText}>Remember me</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Sign in with</Text>
        <View style={styles.socialIcons}>
          <Ionicons name="logo-facebook" size={28} color="#3b5998" />
          <Ionicons name="logo-google" size={28} color="#db4437" />
          {/* <Ionicons name="logo-twitter" size={28} color="#1DA1F2" />
          <Ionicons name="logo-apple" size={28} color="black" /> */}
        </View>
{/*        
        <TouchableOpacity onPress={() => navigation.navigate("register")}>
          <Text style={styles.signupText}>Don't have an account? <Text style={{ fontWeight: "bold" }}>Sign up</Text></Text>
        </TouchableOpacity> */}
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
  container: {
    width: "100%",
    height: "85%", 
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 50,  
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    alignItems: "center",
    elevation: 10, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 5 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 8, 
    position: "absolute",
    bottom: 0, 
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10, 
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
  },
  rememberText: {
    color: "#aaa",
    marginTop:10,
  },
  forgotText: {
    color:"#062654",
    fontWeight: "bold",
    marginTop:10,
  },
  button: {
    backgroundColor: "#062654",
    padding: 15,
    marginBottom:30,
    marginTop:30,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    elevation: 8,
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
    marginTop:10,
  },
  signupText: {
    color: "#777",
  },
});
