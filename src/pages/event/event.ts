import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

import * as firebase from "firebase";

@IonicPage({
	name: 'page-event',
	segment: 'event'
})

@Component({
	selector: 'page-event',
	templateUrl: 'event.html',
})
export class EventPage {

	orders: Array<any> = [];
	public noticeCollection: any;
	public  db = firebase.firestore();
	title:any;
	content:any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public alert:AlertController) {
		this.getOrders();
	}

	getOrders(){
		var menu_a = this.orderAsync().then(menu_a=> this.orders= menu_a)
			.then(()=>console.log(this.orders));
		console.log(this.orders);
	}
	async orderAsync(){
		let menu = await this._order();
		return menu;
	}
	_order():Promise<any>{
		return new Promise<any>(resolve => {
			var order: Array<any>=[];
			this.noticeCollection = this.db.collection("event");
			var orderInfo = this.noticeCollection.get()
				.then(snapshot => {
					snapshot.forEach(doc => {
						order.push({
							title : doc.data().title,
							timeStamp : doc.data().timeStamp,
							content : doc.data().content
						});
					});
					console.log("####", order);
					resolve(order);
				})
				.catch(err => {
					console.log('Error getting documents', err);
				});
		})
	}
	presentAlert(id) {

		let alert = this.alert.create({
			title: "Do you really want to delete the event?",
			buttons: [
				{
					text: 'No',
					handler: () => {
						console.log('Disagree clicked');
					}
				},
				{
					text: 'YES',
					handler: () => {
						this.deleteReview(id)
					}
				}
			]
		});
		alert.present();
	}
	deleteReview(id){
		var orderdoc_id = this.orders[id].timeStamp;

		var reviewRef = this.db.collection('event').where("timeStamp", "==", orderdoc_id).onSnapshot(querySnapshot => {
			querySnapshot.docChanges.forEach(change => {
				const reviewid = change.doc.id;
				this.db.collection('event').doc(reviewid).delete().then(()=>this.presentAlert2()).then(()=>this.navCtrl.setRoot('page-home')).catch(err=> console.log("error"));
				// do something with foo and fooId
				//resolve();
			})
		})
	}
	updateOrder(id) {
		var orderdoc_id = this.orders[id].timeStamp;
		this.navCtrl.push('page-nearby', {'content':this.orders[id].content, 'title':this.orders[id].title, 'timeStamp':orderdoc_id});
	}
	presentAlert2() {

		let alert = this.alert.create({
			title: "Deletion is completed",
			buttons: ["OK"]
		});
		alert.present();
	}

	openCategoryPage() {
		this.navCtrl.push('page-restaurant-detail');
	}
	readmore(id){
		this.navCtrl.push('page-checkout', {'content': this.orders[id].content,'title':this.orders[id].title, 'timeStamp':this.orders[id].timeStamp
		});
	}

}
