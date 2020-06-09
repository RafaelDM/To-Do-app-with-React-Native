import React from 'react';

import {
    StyleSheet,
} from 'react-native';

import { createAppContainer, createSwitchNavigator} from 'react-navigation';

import LogInScreen from './components/LogInScreen'
import LoadingScreen from './components/LoadingScreen'
import MainScreen from './components/MainScreen'
import CreateTaskScreen from './components/CreateTaskScreen'
import { Permissions, Constants, Localization, Calendar } from 'react-native-unimodules';

export default class App extends React.Component {
  async componentWillMount() {
    await this._askForCalendarPermissions();
    await this._askForReminderPermissions();
  }

  _askForCalendarPermissions = async () => {
    await Permissions.askAsync(Permissions.CALENDAR);
  };

  _askForReminderPermissions = async () => {
    if (Platform.OS === 'android') {
      return true;
    }

    await Permissions.askAsync(Permissions.REMINDERS);
  };

  render () {
    return <AppNavigator/>
    }
}

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: LoadingScreen,
  LogInScreen: LogInScreen,
  MainScreen: MainScreen,
  CreateTaskScreen: CreateTaskScreen,
});

const AppNavigator = createAppContainer(AppSwitchNavigator);

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

