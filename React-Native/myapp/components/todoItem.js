import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function TodoItem({ item, pressHandler }) {
    return (
        <TouchableOpacity onPress={() => pressHandler(item.key)}>
            <View style={styles.item}>
                <MaterialIcons name='delete' size={18} color='#333' />
                <Text style={styles.text}>{item.text}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    item: {
      borderColor: '#bbb',
      borderWidth: 1,
      padding: 16,
      marginTop: 16,
      borderStyle: 'dashed',
      borderRadius: 10, 
      flexDirection: 'row'
    },
    text: {
        marginLeft: 10
    }
  });