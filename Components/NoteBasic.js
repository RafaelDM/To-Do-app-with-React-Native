import React from 'react';
import {AsyncStorage} from 'react-native';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
  
} from 'react-native';

export default class NoteBasic extends React.Component{
  
    //    componentDidMount = () => AsyncStorage.getItem('name').then((value) => this.setState({ 'name': value }))
  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('Notes');
      if (value !== null) {
        // We have data!!
        console.log(value);
        this.props.val.note = value.note;
        this.props.val.date = value.date;
      }
    } catch (error) {
      // Error retrieving data
      console.log("no data");
    }
  };
  //   setName = (value) => {AsyncStorage.setItem('name', value); this.setState({ 'name': value }); }
  _storeData = async () => {
    try {
      await AsyncStorage.setItem('note', this.props.val.note);
    } catch (error) {
      // Error saving data
      console.log("error saving data");
    }
  };

  render(){
    return(
      <View key ={this.propskeyval} style={styles.note}>
          <Text style={styles.noteText}>{this.props.val.date}</Text>
          <Text style={styles.noteText}>{this.props.val.note}</Text>
          <TouchableOpacity onPress= {this.props.deleteMethod} style={styles.noteDelete}>
              <Text style={styles.noteDeleteText}> 
              </Text>
          </TouchableOpacity>
          
      </View>

    );
  }
}
const styles = StyleSheet.create({
    note: {
        position: 'relative',
        padding: 20,
        paddingRight:100,
        borderBottomWidth: 2,
        borderBottomColor: '#ededed',
    },
    noteText: {
        paddingLeft: 20,
        borderLeftWidth: 10,
        borderLeftColor: '#e91e63',
    },
    noteDelete: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2980b9',
        padding: 10,
        top: 10,
        bottom: 10,
        right: 10
    },
    noteDeleteText: {
        color: 'white',
    }
  });