import { StyleSheet, TextInput, Pressable, Dimensions , View , Text} from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';



const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;


export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const handelSignUp = () => {
    router.replace('../(tabs)/home');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <View style={styles.separator} />
      <View style={styles.inputView}>
        {/* <TextInput style={styles.input}
          placeholder="First name"
          placeholderTextColor="#9D23CF"
        /> */}

        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#3A3535"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#3A3535"
          value={email}
          onChangeText={setEmail}

        />
         <TextInput
          style={styles.input}
          placeholder="Phone"
          placeholderTextColor="#3A3535"
          value={phone}
          onChangeText={setPhone}

        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#3A3535"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View style={styles.buttonView}>
          <Pressable style={styles.button} onPress={handelSignUp}>
            <Text style={styles.buttonText}>Register</Text>
          </Pressable>
          <View style={styles.sideBySide}>
            <Text style = {{
              fontWeight : "bold" ,
              color:'#3A3535',
              fontSize: (9),

              }}>
              Already have an Email ?
            </Text>
            {/* <Text style={styles.text}>
             "Register Now"
            </Text> */}
{/* 

            <Link href="Account/login" style={styles.text2}> "Sign In Now" </Link> */}
          </View>

        </View>
        {/* </View> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#Ffff',
  },
  text2: {
    fontWeight: "bold",
    color:"#3A3535"
  },
  sideBySide: {
    backgroundColor:'#F4F4F4',
    flexDirection: "row",
  },
  title: {
    fontSize: 25,

    fontWeight: 'bold',
    color: "#3A3535"
  },
  sep: {
    height: "10%",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  inputView: {
    gap: 15,
    width: "100%",
    paddingHorizontal: 40,
    marginBottom: 5,
    backgroundColor:'#F4F4F4',

  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    borderColor: "#3A3535",
    borderWidth: 0.5,
    borderRadius: 20
  },
  button: {
    marginTop: 40,
    marginBottom: 10,
    backgroundColor: "#062654",
    height: 45,
    // borderColor: "gray",
    // borderWidth: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    // borderRadius: 150,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  },
  buttonView: {
    width: "100%",
    paddingHorizontal: 50,
    backgroundColor:'#F4F4F4',

  },
});
