import {Component} from '@angular/core';
import {
	IonicPage,
	ActionSheetController,
	ActionSheet,
	NavController,
	NavParams,
	ToastController,
	AlertController, LoadingController
} from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {RestaurantService} from '../../providers/restaurant-service-mock';

import leaflet from 'leaflet';
import * as firebase from "firebase";

@IonicPage({
	name: 'page-restaurant-detail'
})

@Component({
    selector: 'page-restaurant-detail',
    templateUrl: 'restaurant-detail.html'
})
export class RestaurantDetailPage {
	noticeTitle: string;
	noticeContent: string;
	favorites: Array<any> = [];
	public  db = firebase.firestore();
	date : any;
	public onYourRestaurantForm: FormGroup;
	email: string;
	constructor(public loadingCtrl: LoadingController, public toastCtrl: ToastController, private _fb: FormBuilder,public navCtrl: NavController, public service: RestaurantService, private alertCtrl: AlertController) {
		// this.getFavorites();
		// console.log(this.favorites);
		firebase.auth().onAuthStateChanged((user)=> {
			if (user) {
				this.email = user.email;
				console.log("%%email", this.email);
			} else {
			}
		});
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
			message: 'Your event was registered!',
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
	addReview(){
		var success  = this.addReviewAsync().then(()=> this.presentToast()).catch();
		//console.log("result:",success);

	}
	async addReviewAsync(){
		let review = await this._addreview();
		return review;
	}

	_addreview():Promise<any>{
		return new Promise<any>(resolve => {
			var success = "success";
			this.date = new Date().toUTCString();
			var addDoc = this.db.collection('event').add({
				title : this.noticeTitle,
				content : this.noticeContent,
				timeStamp: this.date,
				owner: this.email
			}).then(ref=>{
				resolve(success);
				console.log('Added document');
			})

			//   resolve(store);
		})
	}
	presentAlert() {
		let alert = this.alertCtrl.create({
			title: "Event added",
			buttons: ['OK']
		});
		alert.present();
	}

}
