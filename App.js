import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Task from './components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(0);
  const textInput = useRef();

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('taskItems');
        if (value !== null) {
          setTaskItems(JSON.parse(value));
        }
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);

  const handleAddTask = async () => {
    try {
      Keyboard.dismiss();

      // jika text kosong
      if (task === '') {
        return Alert.alert('Peringatan', 'Tugas tidak boleh kosong', [
          {
            text: 'Siap',
            onPress: () => console.log('OK Pressed'),
          },
        ]);
      }

      // jika sudah ada text yg sama
      for (let i = 0; i < taskItems.length; i++) {
        if (taskItems[i] === task) {
          return Alert.alert('Peringatan', 'Tugas tidak boleh sama', [
            {
              text: 'Siap',
              onPress: () => console.log('OK Pressed'),
            },
          ]);
        }
      }

      if (editMode) {
        let newItems = [...taskItems];
        newItems[editIndex] = task;
        setTaskItems(newItems);
        const jsonValue = JSON.stringify(newItems);
        await AsyncStorage.setItem('taskItems', jsonValue);
        setTask('');
        setEditMode(false);
      } else {
        setTaskItems([...taskItems, task]);
        const jsonValue = JSON.stringify([...taskItems, task]);
        await AsyncStorage.setItem('taskItems', jsonValue);
        setTask('');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = item => {
    Alert.alert('Tugas Ini Selesai', item, [
      {
        text: 'Belum',
        onPress: () => console.log('Cancel Pressed'),
      },
      {text: 'Sudah', onPress: () => completedTask(item)},
    ]);

    const completedTask = async item => {
      const newTaskItems = taskItems.filter(_item => _item !== item);
      setTaskItems(newTaskItems);

      try {
        const jsonValue = JSON.stringify(newTaskItems);
        await AsyncStorage.setItem('taskItems', jsonValue);
      } catch (err) {
        console.log(err);
      }
    };
  };

  const handleEdit = (item, i) => {
    textInput.current.focus();
    setTask(item);
    setEditMode(true);
    setEditIndex(i);
  };

  return (
    <View style={styles.container}>
      {/* Today's Task */}
      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>Tugas</Text>

        {/* Items */}
        <View style={styles.items}>
          {taskItems &&
            taskItems.map((item, i) => (
              <Task
                key={i}
                text={item}
                handleDelete={() => handleDelete(item)}
                handleEdit={() => handleEdit(item, i)}
              />
            ))}
        </View>
      </View>

      {/* Write a task */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.writeTaskWrapper}>
        <TextInput
          ref={textInput}
          style={styles.input}
          placeholder="Tulis tugas hari ini"
          placeholderTextColor="#777"
          value={task}
          onChangeText={text => setTask(text)}
        />

        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}>
            <Text style={{...styles.addText, fontSize: editMode ? 18 : 24}}>
              {editMode ? 'Ubah' : '+'}
            </Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  tasksWrapper: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: '75%',
    color: '#333',
  },
  addWrapper: {
    height: 60,
    width: 60,
    backgroundColor: '#fff',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {
    fontSize: 18,
    color: '#333',
  },
});
