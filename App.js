import React, { Component } from 'react'
import { StyleSheet, Text, View, Button, ToastAndroid } from 'react-native'
import BTSerial from 'react-native-android-btserial'

export default class App extends Component {
  state  = { devices: [], connected: false }
 
  render() {
    let { devices, connected } = this.state

    const BTOn = () => BTSerial.enableBT(function (err, enabled) {
                          if (err) ToastAndroid.show('BlueTooth is not available', ToastAndroid.LONG)
                          ToastAndroid.show('BlueTooth is on', ToastAndroid.SHORT)
                        })

    const write = (string) => BTSerial.write(string, null, function (err) {
                                if (err) ToastAndroid.show('ERROR!', ToastAndroid.LONG)
                                ToastAndroid.show('Successful!', ToastAndroid.SHORT)
                              })

    const getDevices = () => {
      BTSerial.listDevices((err, BTdevices) => {
        if (BTdevices) {
          let devices = Object.values(JSON.parse(BTdevices))
          this.setState({devices})
        }
      })
    }

    const connect = (address) => {
      BTSerial.connect(address, (err, status, deviceName) => {
        if (status) {
          this.setState({connected: true})
          ToastAndroid.show('Successful!', ToastAndroid.SHORT)
        }
      })
    }

    return (
      <View style={styles.container}>
         <Text style={styles.welcome}>
          Start BlueTooth
        </Text>
        <Button
          onPress={BTOn}
          title="Switch on"
          color="lightseagreen"
        />
        <Text style={styles.welcome}>
          Search for devices
        </Text>
        <Button
          onPress={getDevices}
          title="Show devices"
          color="lightseagreen"
        />
        {devices.map((device,i) => {
          return (
            <View key={i} style={{margin:4}}>
            <Button
              onPress={()=> connect(device.address)}
              title={device.name}
              color="lightblue"
            />
            </View>
            )
        })}

        {connected ? <Text>Connected to a BlueTooth device</Text>: <Text>Not connected to a BlueTooth device</Text>}
        { connected ?  <Button
          onPress={() => write('test')}
          title="Write test data"
          color="darkolivegreen"
        /> : null }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    marginBottom: 5,
  },
})
