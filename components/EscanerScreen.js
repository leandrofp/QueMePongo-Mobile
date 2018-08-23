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
  Image
} from 'react-native';
import { RNCamera } from 'react-native-camera';



console.disableYellowBox = true;

export default class EscanerScreen extends Component {
  
  constructor(props){
    super(props);
    this.state = {data:'', modal:false}
    this.sendImage = this.sendImage.bind(this)
    this.handleResponse = this.handleResponse.bind(this)
  }

  takePicture = async function() {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options)
      //console.log(data)                 // DATA ES LA FOTO TOMADA, URI ES LA UBICACION EN CACHE DONDE LA GUARDA
      this.setState({data:data.uri, modal:false})
      
      //const a =(this.sendImage(data.base64))
      
    }
  }

  /*async*/ sendImage(data){
       

    /* envio el texto base64 plano, sin formato json */
    var params = {
      data, 
    }
    //console.log(data)
    const requestOptions = {
      method: 'POST',
      /*headers: {
        'Content-Type': 'application/json',
      },*/
      body: data,
    };

      // TODO: RESOLVER COMUNICACION CON ESCRITORIO NO CREO SALGA CON FETCH
    return /*await*/ fetch('http://192.168.101.249:8080/savePhoto' , requestOptions )//.then(this.handleResponse) // NO ANDA LOCALHOST USAR IP MAQUINA
    
    }

  handleResponse(response) {
    console.log("entre")
    if (!response.ok) {
        return Promise.reject(response.statusText); // retorna cadena vacia
    }
    return response.json();
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