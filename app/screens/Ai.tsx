import React, { useState, useEffect } from 'react';
import {
  View, Text, Alert, TextInput, StyleSheet,
  FlatList, KeyboardAvoidingView, Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from "../../config/firebaseConfig"
const screenWidth = Dimensions.get('window').width;

const daysMapping = {
  Monday: 0, Tuesday: 1, Wednesday: 2,
  Thursday: 3, Friday: 4, Saturday: 5, Sunday: 6,
};

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

function predictMissProbability(entry: { time: any; day: any; online: any; lastInterval: any; }, weights: { coeffs: any; bias: any; }) {
  const x = [
    entry.time === 'morning' ? 0 : 1,
    daysMapping[entry.day as keyof typeof daysMapping],
    entry.online,
    entry.lastInterval,
  ];
  let z = weights.bias;
  for (let i = 0; i < weights.coeffs.length; i++) {
    z += weights.coeffs[i] * x[i];
  }
  return sigmoid(z);
}

const Ai = () => {
  const [time, setTime] = useState('morning');
  const [day, setDay] = useState('Monday');
  const [online, setOnline] = useState('1');
  const [lastInterval, setLastInterval] = useState('');
  const [predictedProb, setPredictedProb] = useState<number | null>(null);
  const [graphData, setGraphData] = useState<number[]>([]);
  interface Entry {
    id: string;
    time: string;
    day: string;
    online: string;
    lastInterval: string;
    probability: string;
  }

  const [entries, setEntries] = useState<Entry[]>([]);

  const weights = {
    coeffs: [1.2, 0.3, -0.8, 0.5],
    bias: -4.5,
  };

  useEffect(() => {
    const loadData = async () => {
      const user = auth.currentUser;
      if (user) {
        const key = `missEntries-${user.uid}`;
        const saved = await AsyncStorage.getItem(key);
        if (saved) {
          setEntries(JSON.parse(saved));
          setGraphData(JSON.parse(saved).map((e: { probability: string; }) => parseFloat(e.probability)));
        }
      }
    };
    loadData();
  }, []);

  const handlePredict = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'You must be logged in to use prediction.');
      return;
    }
  
    if (!lastInterval) {
      Alert.alert('Missing Input', 'Please enter hours since last dose.');
      return;
    }
  
    const entry = {
      time,
      day,
      online: parseInt(online),
      lastInterval: parseFloat(lastInterval),
    };
  
    const prob = predictMissProbability(entry, weights);
    setPredictedProb(prob);
  
    const newEntry = {
      id: Date.now().toString(),
      time,
      day,
      online: online === '1' ? 'Yes' : 'No',
      lastInterval,
      probability: (prob * 100).toFixed(2),
    };
  
    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    setGraphData((prev) => [...prev, prob * 100]);
  
    await AsyncStorage.setItem(`missEntries-${user.uid}`, JSON.stringify(updatedEntries));
  
    if (prob > 0.7) {
      Alert.alert('Reminder', 'You might forget this dose. Please be careful!');
    }
  };
  
  const clearEntries = async () => {
    try {
      await AsyncStorage.removeItem('missEntries');
      setEntries([]);
      Alert.alert('Data Cleared', 'All saved predictions have been removed.');
    } catch (e) {
      console.error('Failed to clear entries:', e);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <FlatList
       showsVerticalScrollIndicator={false}
       contentContainerStyle={{ paddingBottom:40}}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Miss Dose (AI Prediction )</Text>

            <Text style={styles.label}>Time of Day</Text>
            <Text style={[styles.label, { fontSize: 14 }]}>Was the device online?</Text>
<View style={[styles.input, { height: 40 }]}>
  <Picker
    selectedValue={online}
    onValueChange={setOnline}
    style={{ color: '#062654', fontSize: 13 }}
    itemStyle={{ fontSize: 13 }}
    dropdownIconColor="#062654"
  >
    <Picker.Item label="Yes" value="1" />
    <Picker.Item label="No" value="0" />
  </Picker>
</View>

<Text style={[styles.label, { fontSize: 14 }]}>Day of the Week</Text>
<View style={[styles.input, { height: 40 }]}>
  <Picker
    selectedValue={day}
    onValueChange={setDay}
    style={{ color: '#062654', fontSize: 13 }}
    itemStyle={{ fontSize: 13 }}
    dropdownIconColor="#062654"
  >
    {Object.keys(daysMapping).map((d) => (
      <Picker.Item key={d} label={d} value={d} />
    ))}
  </Picker>
</View>

<View style={[styles.input, { height: 40 }]}>
  <Picker
    selectedValue={time}
    onValueChange={setTime}
    style={{ color: '#062654', fontSize: 13 }}
    itemStyle={{ fontSize: 13 }}
    dropdownIconColor="#062654"
  >
    <Picker.Item label="Morning" value="morning" />
    <Picker.Item label="Night" value="night" />
  </Picker>
</View>

            <Text style={styles.label}>Hours since last dose</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={lastInterval}
              onChangeText={setLastInterval}
              placeholder="e.g., 5"
              placeholderTextColor="#888"
            />

            <TouchableOpacity style={styles.button} onPress={handlePredict}>
              <Text style={styles.buttonText}>Predict Next Dose</Text>
            </TouchableOpacity>

            {predictedProb !== null && (
              <Text style={styles.resultText}>
                Prediction: {(predictedProb * 100).toFixed(2)}%
              </Text>
            )}

            {graphData.length > 0 && (
              <LineChart
                data={{
                  labels: graphData.map((_, i) => (i + 1).toString()),
                  datasets: [{ data: graphData }],
                }}
                width={screenWidth - 40}
                height={220}
                yAxisSuffix="%"
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(6, 38, 84, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#FFD700',
                  },
                }}
                bezier
                style={{
                  marginVertical: 20,
                  borderRadius: 16,
                }}
              />
            )}

            {entries.length > 0 && (
              <Text style={styles.label}>Saved Predictions</Text>
            )}

            <TouchableOpacity style={styles.clearButton} onPress={clearEntries}>
              <Text style={styles.clearButtonText}>Clear Saved Predictions</Text>
            </TouchableOpacity>
          </View>
        }
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.entryItem}>
            <Text style={styles.entryText}>
              {item.day}, {item.time} | Online: {item.online} | {item.lastInterval}h → {item.probability}%
            </Text>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#062654',
    textAlign: 'center',
    marginTop:30,
    marginBottom: 26,
  },
  label: {
    marginTop: 15,
    fontSize: 16,
    color: '#2265A2',
    fontWeight: '600',
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#7FADE0',
    borderWidth: 1,
    height: 40, 
    justifyContent: 'center',
  },
  
  input: {
    borderWidth: 1,
    borderColor: '#7FADE0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 0, 
    backgroundColor: '#fff',
    color: '#062654',
    marginTop: 5,
    marginBottom: 15,
    height: 40, 
    justifyContent:'center',
  },
  button: {
    backgroundColor: '#7FADE0',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#2265A2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
  resultText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
    color: '#062654',
    textAlign: 'center',
  },
  entryItem: {
    backgroundColor: '#ffffff',
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
    borderColor: '#7FADE0',
    borderWidth: 1,
    shadowColor: '#7FADE0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  entryText: {
    fontSize: 14,
    color: '#062654',
  },
  clearButton: {
    backgroundColor: '#062654',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#ff4d4d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 3,
  },
  clearButtonText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize:16,
},
});

export default Ai;
