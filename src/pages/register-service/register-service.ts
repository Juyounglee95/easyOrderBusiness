import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import * as firebase from "firebase";
import 'firebase/firestore';
import {NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions, NativeGeocoderForwardResult} from "@ionic-native/native-geocoder";

/**
 * Generated class for the RegisterServicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
	name :'page-register-service'
})
@Component({
  selector: 'page-register-service',
  templateUrl: 'register-service.html',
})
export class RegisterServicePage {
	date : any;
	email : any;
	name: any;
	phone: any;
	location: Array<any>=[];
	address: any;
	business_hours: any;
	public  db = firebase.firestore();
  constructor(private nativeGeocoder: NativeGeocoder, public navCtrl: NavController, public navParams: NavParams,private alertCtrl: AlertController) {
	this.email = this.navParams.get("email");
  }
	RegisterService(){
		var success  = this.RegisterAsync().then(()=> this.presentAlert()).then(()=>{this.navCtrl.push('page-home');}).catch();

	}
	async RegisterAsync(){
		let reg = await this._addservice();
		return reg;
	}
	presentAlert() {

		let alert = this.alertCtrl.create({
			title: "Register Applied",
			buttons: ['OK']
		});
		alert.present();
	}

	_addservice():Promise<any>{
		return new Promise<any>(resolve => {
			var success = "success";
			this.date = new Date().toUTCString();
			//this.id = this.id.toString();
			let options: NativeGeocoderOptions = {
				useLocale: true,
				maxResults :5
			};
			this.nativeGeocoder.forwardGeocode(this.address, options)
				.then((coordinates: NativeGeocoderForwardResult[]) => this.location= coordinates)
				.catch((error: any) => console.log(error));


			var addDoc = this.db.collection('owner').add({
				email : this.email,
				status : '1',
				phone : this.phone
			}).
			then(()=>{
				var addStore = this.db.collection('store').add({
					code:"",
					info:this.address+", "+this.business_hours,
					location: this.location[0].latitude+","+this.location[0].longitude,
					name : this.name,
					owner: this.email,
					phone: this.phone,
					service_status: '1'
				}).then(()=>{
					resolve(success)
				})
			})

			//   resolve(store);
		})
	}
  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterServicePage');
  }

}
