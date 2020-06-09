import React from 'react';

import {
    StyleSheet,
    View,
    ActivityIndicator
} from 'react-native';

import { AccessToken } from 'react-native-fbsdk';

export default class LoadingScreen extends React.Component {
    componentDidMount(){
        this.checkIfLoggedIn();
    }

    checkIfLoggedIn = () => {
        AccessToken.getCurrentAccessToken().then( (data) => { 
            if(data){
                console.log(data);
                this.props.navigation.navigate('MainScreen');
            }else{
                console.log("NOT logged in", data);
                this.props.navigation.navigate('LogInScreen');
            }
        }) //Refresh it every time
        .catch(error =>{
            console.log("error - not logged in", error);
            this.props.navigation.navigate('LogInScreen');
        });
    }

    render () {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large"/>
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

