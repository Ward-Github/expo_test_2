import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {  Alert, StyleSheet, Text, View, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function App() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [kilometersNeeded, setKilometersNeeded] = useState<string>('');
  const [selectedTimeOption, setSelectedTimeOption] = useState<string | null>(null);
  const [isCreateEnabled, setIsCreateEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (selectedOption && kilometersNeeded && selectedTimeOption) {
      setIsCreateEnabled(true);
    } else {
      setIsCreateEnabled(false);
    }
  }, [selectedOption, kilometersNeeded, selectedTimeOption]);

  const selectOption = (option: string) => {
    setSelectedOption(option);
  };

  const selectTimeOption = (option: string) => {
    setSelectedTimeOption(option);
  };

  const handleKilometersChange = (value: string) => {
    const regex = /^[0-9]*$/;
    if (regex.test(value)) {
      setKilometersNeeded(value);
    }
  };

  const handleCreateReservation = () => {
    fetch('http://localhost:3000/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        option: selectedOption,
        kilometers: kilometersNeeded,
        time: selectedTimeOption,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Reservation created:', data);
        Alert.alert('Success', 'Reservation has been created');
        setSelectedOption(null);
        setKilometersNeeded('');
        setSelectedTimeOption(null);
        setIsCreateEnabled(false);
      })
      .catch((error) => {
        console.error('Error creating reservation:', error);
        Alert.alert('Error', 'Error creating reservation');
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <MaterialIcons name="menu" size={40} color="white" style={styles.menuIcon} />
          <Text style={styles.topBarText}>Create Reservation</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.bigOptionText}>1. Priority</Text>
          <View style={styles.optionsContainer}>
            <OptionButton
              color="#28a745"
              text="I can wait"
              onPress={() => selectOption('canWait')}
              selected={selectedOption === 'canWait'}
            />
            <OptionButton
              color="#ffc107"
              text="Would be nice"
              onPress={() => selectOption('wouldBeNice')}
              selected={selectedOption === 'wouldBeNice'}
            />
            <OptionButton
              color="#fd7e14"
              text="Could really use it"
              onPress={() => selectOption('couldReallyUseIt')}
              selected={selectedOption === 'couldReallyUseIt'}
            />
            <OptionButton
              color="#dc3545"
              text="I need it right now"
              onPress={() => selectOption('needItRightNow')}
              selected={selectedOption === 'needItRightNow'}
            />
          </View>
          <Text style={styles.bigOptionText}>2. Kilometers needed</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter kilometers"
              keyboardType="numeric"
              value={kilometersNeeded}
              onChangeText={handleKilometersChange}
            />
          </View>
          <Text style={styles.bigOptionText}>3. Time</Text>
          <View style={styles.optionsContainer}>
            <OptionButton
              color="white"
              text="Today"
              onPress={() => selectTimeOption('today')}
              selected={selectedTimeOption === 'today'}
            />
            <OptionButton
              color="white"
              text="Tomorrow"
              onPress={() => selectTimeOption('tomorrow')}
              selected={selectedTimeOption === 'tomorrow'}
            />
          </View>
          <Text style={styles.bigOptionText}>4. Create</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[styles.optionButton, { borderColor: isCreateEnabled ? '#28a745' : '#ccc', backgroundColor: isCreateEnabled ? '#28a745' : '#222222' }]}
              onPress={isCreateEnabled ? handleCreateReservation : undefined}
              disabled={!isCreateEnabled}
            >
              <Text style={[styles.optionText, { color: isCreateEnabled ? '#222222' : '#ccc' }]}>Create Reservation</Text>
            </TouchableOpacity>
          </View>
        </View>
        <StatusBar style="auto" />
      </View>
    </TouchableWithoutFeedback>
  );
}

const OptionButton = ({ color, text, onPress, selected }: { color: string; text: string; onPress: () => void; selected: boolean }) => (
  <TouchableOpacity
    style={[styles.optionButton, { borderColor: color, backgroundColor: selected ? color : '#222222' }]}
    onPress={onPress}
  >
    <Text style={[styles.optionText, { color: selected ? '#222222' : '#fff' }]}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222',
  },
  topBar: {
    backgroundColor: '#222222',
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginTop: 25
  },
  menuIcon: {
    marginRight: 10,
  },
  topBarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    backgroundColor: '#222222',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  bigOptionText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  optionButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
    borderWidth: 2,
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingLeft: 10,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
  },
  createButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
  
