/*'use strict';
import React, {Component} from 'react';
import {Alert, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import TouchID from 'react-native-touch-id';
import MainIncognite from './Components/MainIncognite';




export default class App extends Component<{}> {
  
  constructor() {
    super();
    this.state = {
      biometryType: null,
    };
  }

  componentDidMount() {
    TouchID.isSupported().then(biometryType => {
      this.setState({biometryType});
    });
  }


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Join To Do App</Text>

        <TouchableHighlight
          style={styles.btn2}
          onPress={this._clickHandler}
          underlayColor="#0380BE"
          activeOpacity={1}>
          <Text
            style={{
              color: '#fff',
              fontWeight: '600',
            }}>
            {`Join with Touch ID`}
          </Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.btn}
          onPress={this._clickHandler}
          underlayColor="#0380BE"
          activeOpacity={1}>
          <Text
            style={{
              color: '#fff',
              fontWeight: '600',
            }}>
            {`Join with Facebook`}
          </Text>
        </TouchableHighlight>
      </View>
      
    );
  }

  _clickHandler() {
    TouchID.isSupported()
      .then(authenticate)
      .catch(error => {
        Alert.alert('TouchID not supported');
      });
  }
}

function authenticate() {
  return TouchID.authenticate()
  .then(success => {
    //aquí va la navegación hacía incognite mode
    
  })
    .catch(error => {
      console.log(error);
      Alert.alert(error.message);
    });
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
  },
  welcome: {
    margin: 10,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: 'white',
  },
  instructions: {
    marginBottom: 5,
    color: '#333333',
    fontSize: 13,
    textAlign: 'center',
  },
  btn: {
    borderRadius: 3,
    marginTop: 50,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#0391D7',
  },
  btn2: {
    borderRadius: 3,
    marginTop: 50,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: 'black',
  },
});*/


import React from 'react';
import MainBasic from './Components/MainBasic';
import MainIncognite from './Components/MainIncognite';

export default class App extends React.Component{
  render(){
    return(
      <MainIncognite/>
    );
  }
}