import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { Pressable ,View } from 'react-native'
import { router } from 'expo-router'


const handelSignin = () => {
  router.replace('../Account/register'); 
  }


export default function Login() {
  return (
    <View style={styles.buttonView}>
    <Pressable style={styles.button} onPress={handelSignin}>
      <Text style={styles.buttonText}>Login</Text>
    </Pressable>
    </View>
    );

}

const styles = StyleSheet.create({

  button: {
    position: 'relative',
    backgroundColor: "#062654",
    // width: width * 0.70,
    // height: height * 0.06,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    // marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  },
  buttonView: {
    backgroundColor: '#FFFFFF',
  },
  },
  
  )