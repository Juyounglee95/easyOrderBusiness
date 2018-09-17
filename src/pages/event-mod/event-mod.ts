import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {RestaurantService} from "../../providers/restaurant-service-rest";
import * as firebase from "firebase";

/**
 * Generated class for the EventModPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
	name: 'page-event-mod',
	segment: 'event-mod'
})
@Component({
  selector: 'page-event-mod',
  templateUrl: 'event-mod.html',
})
export class EventModPage {

	restaurants: Array<any>;
	map;
	markersGroup;
	noticeTitle : any;
	noticeContent : any;
	timeStamp:any;
	orders: Array<any> = [];
	public noticeCollection: any;
	public  db = firebase.firestore();

	constructor(public navCtrl: NavController, private alertCtrl: AlertController,public service: RestaurantService, public navParams: NavParams) {
		this.noticeTitle= this.navParams.get("title");
		this.noticeContent= this.navParams.get("content");
		this.timeStamp=this.navParams.get('timeStamp');
		console.log(this.timeStamp)
	}

	presentAlert() {

		let alert = this.alertCtrl.create({
			title: "Review edited",
			buttons: ['OK']
		});
		alert.present();
	}
	addReview(){
		var success  = this.editReviewAsync().then(()=> this.presentAlert()).then(()=>{this.navCtrl.push('page-home');}).catch();
		//console.log("result:",success);
	}

	async editReviewAsync(){
		let review = await this._editreview();
		return review;
	}

	_editreview():Promise<any>{
		return new Promise<any>(resolve => {
			var success = "success";
			var reviewRef = this.db.collection('event').where("timeStamp", "==", this.timeStamp).onSnapshot(querySnapshot => {
				querySnapshot.docChanges.forEach(change => {
					console.log(change)
					const reviewid = change.doc.id;
					this.db.collection('event').doc(reviewid).update({title: this.noticeTitle, content : this.noticeContent});
					// do something with foo and fooId
					resolve();
				})
			})

			//   resolve(store);
		})
	}


}
