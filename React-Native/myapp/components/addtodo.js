import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, Button, View} from 'react-native';

export default function AddToDo({ submitHandler }) {

    const [text, setText] = useState('');

    const changeHandler = (val) => {
        setText(val);
    }

    return (
        <View>
          <TextInput 
            style={styles.input} 
            placeholder='new todo...'
            onChangeText={changeHandler}
            value={text} 
          />
          <Button color='coral' onPress={() => submitHandler(text)} title='add todo' />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
      paddingHorizontal: 8,
      paddingVertical: 6,
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
  });