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
            //console.log("CONCEPTS : " , concepts[0] , concepts[1] , concepts[2] )
            
            if (concepts && concepts.length > 0) {
            
              concepts[0].name = this.tipoPrenda(concepts[0].name)
              concepts[1].name = this.tipoPrenda(concepts[1].name)
      
              if(concepts[0].name != '0'){


                let tipo1name =concepts[0].name
                let tipo1value = concepts[0].value

                
                clarifai.models.predict(Clarifai.COLOR_MODEL, file).then(response => {
                
              
                let color1name = response.outputs[0].data.colors[0].w3c.name
                let color1value = response.outputs[0].data.colors[0].value

                console.log(response.outputs[0].data.colors[0].w3c.name , )
                console.log(response.outputs[0].data.colors[0].value , )
                Alert.alert(tipo1name + ' ' + tipo1value + '    ' + color1name + '  ' + color1value)
                  
                }).catch(e => {
                  Alert.alert(
                    'Error en el reconocimiento de color, intente nuevamente',
                    [
                      { text: 'OK', onPress: () => this._cancel() },
                    ],
                    { cancelable: false }
                    )
                })
              }
              else{
                //console.log("No se reconocio el tipo de prenda")
                Alert.alert("No se reconocio el tipo de prenda")
              }
            }
            
        })
        .catch(e => {
          Alert.alert(
            'Error en el reconcimiento de ropa, intente nuevamente',
            [
              { text: 'OK', onPress: () => this._cancel() },
            ],
            { cancelable: false }
            )
        })
    }

  tipoPrenda = (prenda) => {
      console.log("LLEGO PRENDA" , prenda)
      let tipoPrenda;

      if( prenda == "Shirt" || prenda == "T-Shirt" || prenda == "Tank Top" || prenda == "Activewear" || prenda == "T Shirt" || prenda == "Polos")
          tipoPrenda = "Remera"			// polo = Chomba
      else if(prenda == "Capris" || prenda == "Jeans" || prenda == "Skinny Pants" || prenda == "Tracksuit" || prenda == "Overalls" ||
          prenda ==  "Relaxed Pants" || prenda == "Wide Leg Pants" || prenda == "Pant Suit")
          tipoPrenda = "Pantalon"		// PANT SUIT creo que es pantalón formal, de traje
      else  if(prenda == "Fleece Jacket" || prenda == "Sweatshirt" || prenda == "Leather Jacket" || prenda == "Denim Jacket" || prenda == "Bomber Jacket")
          tipoPrenda ="Buzo"	
      else  if(prenda == "Sweater" )
          tipoPrenda ="Pulover"	
      else  if(prenda == "Peacoat")
          tipoPrenda ="Saco"			// DE TRAJE
      else  if(prenda == "Women's Short" || prenda == "Men's Shorts" || prenda=="Cargo Shorts")
        "Pantalon Corto"
      else  if(prenda == "Cocktail Dress" || prenda == "Maxi Skirt" || prenda== "Sarong" || prenda == "Casual Dress")
        tipoPrenda = "Vestido"
      else  if(prenda == "Women's Short Shorts" || prenda == "Jean Skirt" || prenda == "Women's Jean Shorts" || prenda=="Knee Length Skirt" || prenda=="Mini Skirt")
        tipoPrenda = "Pollera"
      else if(prenda == "Spring Jacket" || prenda == "Blazer" || prenda == "Button-Down")        // ver el buttom-down
        tipoPrenda = "Camisa" // VER SI APLICA PARA SACO DE TRAJE
      else if(prenda == "Skinny Pants")
        tipoPrenda = "Calza"
      /*else  if()
      tipoPrenda "Toleras"*/
      else if(prenda == "Raincoats")
        tipoPrenda = "Campera de lluvia"
      else
        tipoPrenda = '0'    // no la reconocio
      return tipoPrenda
  }

  /*colorPrenda = (data) => {

  }

  errorTipo = (porcentaje) =>{
    if( parseInt(porcentaje) < 0.6)
      return false
    return true
  }*/

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