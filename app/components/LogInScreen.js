import React from 'react';

import {
    StyleSheet,
    View,
} from 'react-native';

import { LoginButton, AccessToken } from 'react-native-fbsdk';
 
import { GoogleSignin } from '@react-native-community/google-signin';

GoogleSignin.configure({
  webClientId: '82821064478-261cvv9ae68jce9asl4v8knqvtqd5ktq.apps.googleusercontent.com',
});

export default class LogInScreen extends React.Component {
    render () {
        return (
            <View style={styles.container}>
                <LoginButton
                onLoginFinished={
                (error, result) => {
                    if (error) {
                    console.log("login has error: " + result.error);
                    } else if (result.isCancelled) {
                    console.log("login is cancelled.");
                    } else { // Success
                        AccessToken.getCurrentAccessToken().then( (data) => {
                            navigation.navigate('MainScreen')
                            // console.log(data.accessToken.toString())
                        });
                    }
                }
                }
                onLogoutFinished={() => console.log("logout.")}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#F5FCFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'normal',
        marginBottom: 48,
    },
});

