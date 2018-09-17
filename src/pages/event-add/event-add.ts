import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {RestaurantService} from "../../providers/restaurant-service-rest";
import * as firebase from "firebase";

/**
 * Generated class for the EventAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
	name: 'page-event-add',
	segment: 'event-add'
})
@Component({
  selector: 'page-event-add',
  templateUrl: 'event-add.html',
})
export class EventAddPage {
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
