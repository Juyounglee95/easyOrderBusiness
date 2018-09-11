import {Component} from '@angular/core';
import {
	IonicPage,
	ActionSheetController,
	ActionSheet,
	NavController,
	NavParams,
	ToastController,
	AlertController
} from 'ionic-angular';

import {RestaurantService} from '../../providers/restaurant-service-mock';
import {DishService} from '../../providers/dish-service-mock';
import {CartService} from '../../providers/cart-service-mock';

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

	constructor(public navCtrl: NavController, public service: RestaurantService, private alertCtrl: AlertController) {
		// this.getFavorites();
		// console.log(this.favorites);
	}
	addReview(){
		var success  = this.addReviewAsync().then(()=> this.presentAlert()).then(()=>{this.navCtrl.push('page-home');}).catch();
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
				timeStamp: this.date
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
