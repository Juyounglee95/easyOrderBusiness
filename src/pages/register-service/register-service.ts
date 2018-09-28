import { Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams , LoadingController, ToastController} from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import * as firebase from "firebase";
import 'firebase/firestore';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
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
export class RegisterServicePage implements OnInit{
	date : any;
	email : any;
	name: any;
	phone: any;
	location: Array<any>=[];
	address: any;
	business_hours: any;
	public  db = firebase.firestore();
	public onYourRestaurantForm: FormGroup;
  constructor(public loadingCtrl: LoadingController, public toastCtrl: ToastController, private _fb: FormBuilder,private nativeGeocoder: NativeGeocoder, public navCtrl: NavController, public navParams: NavParams,private alertCtrl: AlertController) {
	this.email = this.navParams.get("email");
  }
	ngOnInit() {
		this.onYourRestaurantForm = this._fb.group({

			restaurantTitle: ['', Validators.compose([
				Validators.required
			])],
			restaurantAddress: ['', Validators.compose([
				Validators.required
			])],
			restaurantPhone: ['', Validators.compose([
				Validators.required
			])],
			restaurantHours: ['', Validators.compose([
				Validators.required
			])]
		});
	}
	RegisterService(){
//		var success  = this.RegisterAsync().then(()=> this.presentAlert()).then(()=>{this.navCtrl.push('page-home');}).catch();
		var success  = this.RegisterAsync().then(()=> this.presentToast()).catch();

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
	presentToast() {
		// send booking info
		let loader = this.loadingCtrl.create({
			content: "Please wait..."
		});
		// show message
		let toast = this.toastCtrl.create({
			showCloseButton: true,
			cssClass: 'profiles-bg',
			message: 'Your restaurant was registered!',
			duration: 3000,
			position: 'bottom'
		});

		loader.present();

		setTimeout(() => {
			loader.dismiss();
			toast.present();
			// back to home page
			this.navCtrl.setRoot('page-home');
		}, 3000)
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

			console.log(this.business_hours, this.address, this.phone);
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
					address: this.address,
					hours: this.business_hours,
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


}
