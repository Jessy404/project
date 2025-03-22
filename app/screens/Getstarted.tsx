import React from "react";
import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const GetStarted = () => {
  const router = useRouter();

  return (
    <ImageBackground source={require("../../assets/images/blue.jpeg")} style={styles.background}>
      <View style={styles.overlay} />
      <View style={styles.content}>

        <Text style={styles.title}>
          What’s the <Text style={styles.highlight}>time?</Text>
        </Text>
        <Text style={styles.subtitle}>
          Stay organized with your medication schedule. Never miss a dose, stay healthy.
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push("/Account/signin")}>
          <Text style={styles.buttonText}>Get started →</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  content: {
    paddingHorizontal: 30,
    alignItems: "center",
  },
  brand: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  highlight: {
    color: "#2ACAE1",
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#fff",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default GetStarted;
