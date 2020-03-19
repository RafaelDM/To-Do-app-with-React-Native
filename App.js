import React, { Component } from 'react';
import { View } from 'react-native';

import { LoginButton, AccessToken } from 'react-native-fbsdk';

import Main from './APP/Components/Main'; 

import {NavigationContainer, NavigationNativeContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator()

const LogInScreen = ({navigation}) => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <LoginButton
          onLoginFinished={
            (error, result) => {
              if (error) {
                console.log("login has error: " + result.error);
              } else if (result.isCancelled) {
                console.log("login is cancelled.");
              } else { // Success
                AccessToken.getCurrentAccessToken().then(
                  (data) => {navigation.navigate('Main')
                    //console.log(data.accessToken.toString());
                  }
                )
              }
            }
          }
          onLogoutFinished={() => console.log("logout.")}/>
      </View>
)

export default function App(){
  return <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="LogIn" component={LogInScreen}/>
      <Stack.Screen name="Main" component={Main}/>
    </Stack.Navigator>
  </NavigationContainer>
}
