import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import * as firebase from "firebase";
import 'firebase/firestore';
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
	location: any;
	address: any;
	business_hours: any;
	public  db = firebase.firestore();
  constructor(public navCtrl: NavController, public navParams: NavParams,private alertCtrl: AlertController) {
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
			var addDoc = this.db.collection('owner').add({
				email : this.email,
				status : '1',
				phone : this.phone
			}).then(()=>{
				var addStore = this.db.collection('store').add({
					code:"",
					info:this.address+", "+this.business_hours,
					location: this.location,
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
