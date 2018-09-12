'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Image,
  Alert
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import Clarifai from 'clarifai'


const img1 = require('./RN1.jpg')
const img2 = require('./PA1.jpg')

console.disableYellowBox = true;

export default class EscanerScreen extends Component {
  
  constructor(props){
    super(props);
    this.state = {data:'', modal:false}
    this.escaneo = this.escaneo.bind(this)
    //this.handleResponse = this.handleResponse.bind(this)
  }

  takePicture = async function() {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options)
      //console.log(data)                 // DATA ES LA FOTO TOMADA, URI ES LA UBICACION EN CACHE DONDE LA GUARDA
      this.setState({data:data.uri, modal:false})
      
      const a =(this.escaneo(data.base64))
      
    }
  }

    escaneo(data){
        const clarifai = new Clarifai.App({
          apiKey: '2a02c3c45bf54fc0b8f4d95af5b97f12'
        })
    
        process.nextTick = setImmediate // RN polyfill
    
        console.log("PASE POR NEXTICK")

        //const { data } = data
        //const file = { base64: data }
        const file = data
        
        clarifai.models.predict(Clarifai.APPAREL_MODEL, file)
          .then(response => {
            const { concepts } = response.outputs[0].data
            console.log("CONCEPTS : " , concepts[0] , concepts[1] , concepts[2] )
            Alert.alert(concepts[0].name + ' ' + concepts[0].value + '    ' + concepts[1].name + '  ' + concepts[1].value )
            if (concepts && concepts.length > 0) {
              
              
              
              
              /*for (const prediction of concepts) {
                if (prediction.name === 'pizza' && prediction.value >= 0.99) {
                  return this.setState({ loading: false, result: 'Pizza' })
                }
                this.setState({ result: 'Not Pizza' })
              }*/
            }
            //this.setState({ loading: false })
          })
          .catch(e => {
            Alert.alert(
              'ROMPI TODO VIEJA',
              [
                { text: 'OK', onPress: () => this._cancel() },
              ],
              { cancelable: false }
            )
          })
      }

  render() {

    return (
      <View style={styles.container}>
        <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style = {styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.on}
            permissionDialogTitle={'Permission to use camera'}
            permissionDialogMessage={'We need your permission to use your camera phone'}
        />
        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center',}}>
        <TouchableOpacity
            onPress={this.takePicture.bind(this)}
            style = {styles.capture}
        >
            <Text style={{fontSize: 14}}> Escanear prenda </Text>
        </TouchableOpacity>
        </View>
        <Modal visible={this.state.modal} >
            <View>
            <Image
              style={{width: 600, height: 600}}
              source={{uri: this.state.data}}
            />
            </View>
        </Modal>
            
      </View>
    );
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20
  }
});

AppRegistry.registerComponent('EscanerScreen', () => EscanerScreen);