import React, { Component } from 'react';
import {
  Text,
  Image,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  Keyboard,
  Switch,
  StyleSheet,
  Alert,
} from 'react-native';

import { CalendarList } from 'react-native-calendars';
import moment from 'moment';

import { Constants, Localization, Calendar } from 'react-native-unimodules';

import DateTimePicker from 'react-native-modal-datetime-picker';
import uuid from 'uuid';
import { Context } from '../data/Context';

const { width: vw } = Dimensions.get('window');
// moment().format('YYYY/MM/DD')

export default class CreateTaskScreen extends Component {
  state = {
    selectedDay: {
      [`${moment().format('YYYY')}-${moment().format('MM')}-${moment().format(
        'DD'
      )}`]: {
        selected: true,
        selectedColor: '#2E66E7',
      },
    },
    currentDay: moment().format(),
    taskText: '',
    notesText: '',
    keyboardHeight: 0,
    visibleHeight: Dimensions.get('window').height,
    isAlarmSet: false,
    alarmTime: moment().format(),
    isDateTimePickerVisible: false,
    timeType: '',
    createTodo: {},
    createEventAsyncRes: '',
  };

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide
    );
  }

  componentWillUnmount() {
    Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow);
    Keyboard.removeListener('keyboardDidHide', this._keyboardDidHide);
  }

  _keyboardDidShow = e => {
    this.setState({
      keyboardHeight: e.endCoordinates.height,
      visibleHeight:
        Dimensions.get('window').height - e.endCoordinates.height - 30,
    });
  };

  _keyboardDidHide = () => {
    this.setState({
      visibleHeight: Dimensions.get('window').height,
    });
  };

  handleAlarmSet = () => {
    const { isAlarmSet } = this.state;
    this.setState({
      isAlarmSet: !isAlarmSet,
    });
  };

  synchronizeCalendar = async value => {
    const { navigation } = this.props;
    const { createNewCalendar } = navigation.state.params;
    const calendarId = await createNewCalendar();
    try {
      const createEventAsyncRes = await this._addEventsToCalendar(calendarId);
      this.setState(
        {
          createEventAsyncRes,
        },
        () => {
          this._handleCreateEventData(value);
        }
      );
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  _addEventsToCalendar = async calendarId => {
    const { taskText, notesText, alarmTime } = this.state;
    const event = {
      title: taskText,
      notes: notesText,
      startDate: moment(alarmTime)
        .add(0, 'm')
        .toDate(),
      endDate: moment(alarmTime)
        .add(5, 'm')
        .toDate(),
      timeZone: Localization.timezone,
    };

    try {
      const createEventAsyncRes = await Calendar.createEventAsync(
        calendarId.toString(),
        event
      );

      return createEventAsyncRes;
    } catch (error) {
      console.log(error);
    }
  };

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleCreateEventData = async value => {
    const {
      state: {
        currentDay,
        taskText,
        notesText,
        isAlarmSet,
        alarmTime,
        createEventAsyncRes,
      },
      props: { navigation },
    } = this;
    const { updateCurrentTask, currentDate } = navigation.state.params;
    const createTodo = {
      key: uuid(),
      date: `${moment(currentDay).format('YYYY')}-${moment(currentDay).format(
        'MM'
      )}-${moment(currentDay).format('DD')}`,
      todoList: [
        {
          key: uuid(),
          title: taskText,
          notes: notesText,
          alarm: {
            time: alarmTime,
            isOn: isAlarmSet,
            createEventAsyncRes,
          },
          color: `rgb(${Math.floor(
            Math.random() * Math.floor(256)
          )},${Math.floor(Math.random() * Math.floor(256))},${Math.floor(
            Math.random() * Math.floor(256)
          )})`,
        },
      ],
      markedDot: {
        date: currentDay,
        dots: [
          {
            key: uuid(),
            color: '#D2D2D6',
            selectedDotColor: '#D2D2D6',
          },
        ],
      },
    };
    // value issue in ios    
    await value.updateTodo(createTodo);
    await updateCurrentTask(currentDate);
    navigation.navigate('MainScreen');
  };

  _handleDatePicked = date => {
    const { currentDay } = this.state;
    const selectedDatePicked = currentDay;
    const hour = moment(date).hour();
    const minute = moment(date).minute();
    const newModifiedDay = moment(selectedDatePicked)
      .hour(hour)
      .minute(minute);

    this.setState({
      alarmTime: newModifiedDay,
    });

    this._hideDateTimePicker();
  };

  render() {
    const {
      state: {
        selectedDay,
        currentDay,
        taskText,
        visibleHeight,
        notesText,
        isAlarmSet,
        alarmTime,
        isDateTimePickerVisible,
      },
      props: { navigation },
    } = this;

    return (
      <Context.Consumer>
      {value => (
        <>
          <DateTimePicker
            isVisible={isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
            mode="time"
          />

          <View style={styles.container}>
            <View
              style={{
                height: visibleHeight,
              }}
            >
              <ScrollView
                contentContainerStyle={{
                  paddingBottom: 100,
                }}
              >
                <View style={styles.backButton}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('MainScreen')}
                    style={{ marginRight: vw / 2 - 120, marginLeft: 20 }}
                  >
                    <Image
                      style={{ height: 25, width: 40 }}
                      source={require('../images/back.png')}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>

                  <Text style={styles.newTask}>Nueva Tarea</Text>
                </View>
                <View style={styles.calenderContainer}>
                  <CalendarList
                    style={{
                      width: 350,
                      height: 350,
                    }}
                    current={currentDay}
                    minDate={moment().format()}
                    horizontal
                    pastScrollRange={0}
                    pagingEnabled
                    calendarWidth={350}
                    onDayPress={day => {
                      this.setState({
                        selectedDay: {
                          [day.dateString]: {
                            selected: true,
                            selectedColor: '#d2d2d6',
                          },
                        },
                        currentDay: day.dateString,
                        alarmTime: day.dateString,
                      });
                    }}
                    monthFormat="yyyy MMMM"
                    hideArrows
                    markingType="simple"
                    theme={{
                      selectedDayBackgroundColor: '#a8a8ba',
                      selectedDayTextColor: 'white',
                      todayTextColor: '#a8a8ba',
                      backgroundColor: '#8484a3',
                      calendarBackground: '#848694',
                      textDisabledColor: '#626369',
                    }}
                    markedDates={selectedDay}
                  />
                </View>
                <View style={styles.taskContainer}>
                  <TextInput
                    style={styles.title}
                    onChangeText={text => this.setState({ taskText: text })}
                    value={taskText}
                    placeholder="¿Que vamos a hacer?"
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#a8a8ba',
                      marginVertical: 10,
                    }}
                  >
                    Ejemplos
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={styles.respirar}>
                      <Text style={{ textAlign: 'center', fontSize: 14 }}>
                        Respirar
                      </Text>
                    </View>
                    <View style={styles.comer}>
                      <Text style={{ textAlign: 'center', fontSize: 14 }}>
                        Comer
                      </Text>
                    </View>
                    <View style={styles.dormir}>
                      <Text style={{ textAlign: 'center', fontSize: 14,}}>
                        Dormir
                      </Text>
                    </View>
                  </View>
                  <View style={styles.notesContent} />
                  <View>
                    <Text style={styles.notes}>Notas</Text>
                    <TextInput
                      style={{
                        height: 25,
                        fontSize: 19,
                        marginTop: 3,
                        color: 'white',
                      }}
                      onChangeText={text =>
                        this.setState({ notesText: text })
                      }
                      value={notesText}
                      placeholder="Agrega una descripcion"
                    />
                  </View>
                  <View style={styles.seperator} />
                  <View>
                    <Text
                      style={{
                        color: '#d2d2d6',
                        fontSize: 16,
                        fontWeight: '600',
                      }}
                    >
                      Hora
                    </Text>
                    <TouchableOpacity
                      onPress={() => this._showDateTimePicker()}
                      style={{
                        height: 25,
                        marginTop: 3,
                        color: 'white',
                      }}
                    >
                      <Text style={{ fontSize: 19, color: 'white', }}>
                        {moment(alarmTime).format('h:mm A')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.seperator} />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          color: '#9CAAC4',
                          fontSize: 16,
                          fontWeight: '600',
                        }}
                      >
                        Alarma
                      </Text>
                      <View
                        style={{
                          height: 25,
                          marginTop: 3,
                        }}
                      >
                        <Text style={{ fontSize: 19, color: '#d2d2d6', }}>
                          {moment(alarmTime).format('h:mm A')}
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={isAlarmSet}
                      onValueChange={this.handleAlarmSet}
                    />
                  </View>
                </View>
                <TouchableOpacity
                  disabled={taskText === ''}
                  style={[
                    styles.createTaskButton,
                    {
                      backgroundColor:
                        taskText === ''
                          ? '#5fad9b'
                          : '#33edc2',
                    },
                  ]}
                  onPress={async () => {
                    if (isAlarmSet) {
                      await this.synchronizeCalendar(value);
                    }
                    if (!isAlarmSet) {
                      this._handleCreateEventData(value);
                    }
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: 'center',
                      color: 'black',
                    }}
                  >
                    Agregar
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </>
      )}
    </Context.Consumer>
  );
}
}

const styles = StyleSheet.create({
  createTaskButton: {
    width: 252,
    height: 48,
    alignSelf: 'center',
    marginTop: 40,
    borderRadius: 5,
    justifyContent: 'center',
  },
  seperator: {
    height: 0.5,
    width: '100%',
    backgroundColor: '#1e1e2c',
    alignSelf: 'center',
    marginVertical: 20,
  },
  notes: {
    color: '#d2d2d6',
    fontSize: 16,
    fontWeight: '600',
  },
  notesContent: {
    height: 0.5,
    width: '100%',
    backgroundColor: '#1e1e2c',
    alignSelf: 'center',
    marginVertical: 20,
    color: 'white',
  },
  dormir: {
    height: 23,
    width: 51,
    backgroundColor: '#33e1ed',
    justifyContent: 'center',
    borderRadius: 5,
  },
  comer: {
    height: 23,
    width: 59,
    backgroundColor: '#62CCFB',
    justifyContent: 'center',
    borderRadius: 5,
    marginRight: 7,
  },
  respirar: {
    height: 23,
    width: 83,
    backgroundColor: '#33edc2',
    justifyContent: 'center',
    borderRadius: 5,
    marginRight: 7,
  },
  title: {
    height: 25,
    borderColor: '#5DD976',
    borderLeftWidth: 1,
    paddingLeft: 8,
    fontSize: 19,
    color: 'white',
  },
  taskContainer: {
    height: 400,
    width: 327,
    alignSelf: 'center',
    borderRadius: 20,
    shadowColor: '#2E66E7',
    backgroundColor: '#1e1e2c',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowRadius: 20,
    shadowOpacity: 0.2,
    elevation: 5,
    padding: 22,
  },
  calenderContainer: {
    marginTop: 30,
    width: 350,
    height: 350,
    alignSelf: 'center',
    borderRadius: 5,
  },
  newTask: {
    alignSelf: 'center',
    fontSize: 20,
    width: 120,
    height: 25,
    textAlign: 'center',
    color: '#d2d2d6',
  },
  backButton: {
    flexDirection: 'row',
    marginTop: 60,
    width: '100%',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#39394d',
    borderRadius: 5,
  },
});

