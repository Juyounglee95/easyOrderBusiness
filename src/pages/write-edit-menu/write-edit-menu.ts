import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import * as firebase from "firebase";
import 'firebase/firestore';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
/**
 * Generated class for the WriteEditMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
	name:'page-write-edit-menu'
})
@Component({
  selector: 'page-write-edit-menu',
  templateUrl: 'write-edit-menu.html',
})
export class WriteEditMenuPage {

	store : any;
	menu: any;
	time: any;
	date : any;
	name : any;
	price : any;
	id: any;
	public  db = firebase.firestore();
	menu_price : any;
	menu_name: any;
	code : any;
	public onYourRestaurantForm: FormGroup;
  constructor(public loadingCtrl: LoadingController, public toastCtrl: ToastController, private _fb: FormBuilder,public navCtrl: NavController, public navParams: NavParams ,private alertCtrl: AlertController) {
	  this.name = this.navParams.get("name");
	  this.price = this.navParams.get("price");
	  this.id = this.navParams.get("id")
  }
	ngOnInit() {
		this.onYourRestaurantForm = this._fb.group({

			restaurantTitle: ['', Validators.compose([
				Validators.required
			])],
			restaurantAddress: ['', Validators.compose([
				Validators.required
			])],

		});
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
			message: 'Your Menu was changed!',
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
	onModelChange(event){
		console.log(event);
	}
	async editMenuAsync(){
		let menus = await this._editmenu();
		return menus;
	}

	_editmenu():Promise<any>{
		return new Promise<any>(resolve => {
			var success = "success";
			this.date = new Date().toUTCString();
			//var orderid = this.id;
			var code = this.code;
			var reviewRef = this.db.collection('menu').where("id", "==", this.id).onSnapshot(querySnapshot => {
				querySnapshot.docChanges.forEach(change => {
					const reviewid = change.doc.id;
					this.db.collection('menu').doc(reviewid).update({menu: this.menu_name, price : this.menu_price});
					// do something with foo and fooId
					resolve();
				})
			})

			//   resolve(store);
		})
	}


	presentAlert() {

		let alert = this.alertCtrl.create({
			title: "Menu edited",
			buttons: ['OK']
		});
		alert.present();
	}
	addReview(){
		var success  = this.editMenuAsync().then(()=> this.presentToast()).catch();
		console.log("result:",success);

	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad WriteEditMenuPage');
  }

}
