import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

const Task = ({text, handleEdit, handleDelete}) => {
  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <View style={styles.square}></View>
        <Text style={styles.itemText}>{text}</Text>
      </View>
      {/* Right */}
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={handleEdit}>
          <View
            style={{
              ...styles.circular,
              backgroundColor: '#3498db',
              marginRight: 10,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <View style={{...styles.circular, backgroundColor: '#e74c3c'}} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Task;

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: 'skyblue',
    opacity: 0.6,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: '80%',
    color: '#333',
    fontSize: 16,
  },
  circular: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});
