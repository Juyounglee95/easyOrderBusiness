import {Component} from '@angular/core';
import {
	IonicPage,
	NavController,
	ModalController,
	NavParams,
	AlertController,
	LoadingController,
	ToastController
} from 'ionic-angular';
import {RestaurantService} from '../../providers/restaurant-service-mock';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import leaflet from 'leaflet';
import * as firebase from "firebase";

@IonicPage({
	name: 'page-nearby',
	segment: 'nearby'
})

@Component({
    selector: 'page-nearby',
    templateUrl: 'nearby.html'
})
export class NearbyPage {
	restaurants: Array<any>;
	map;
	markersGroup;
	noticeTitle : any;
	noticeContent : any;
	timeStamp:any;
	orders: Array<any> = [];
	public noticeCollection: any;
	public  db = firebase.firestore();
	public onYourRestaurantForm: FormGroup;
	constructor(public loadingCtrl: LoadingController, public toastCtrl: ToastController, private _fb: FormBuilder,public navCtrl: NavController, private alertCtrl: AlertController,public service: RestaurantService, public navParams: NavParams) {
		this.noticeTitle= this.navParams.get("title");
		this.noticeContent= this.navParams.get("content");
		this.timeStamp=this.navParams.get('timeStamp');
		console.log(this.timeStamp)
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
			message: 'Your Event was changed!',
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














	presentAlert() {

		let alert = this.alertCtrl.create({
			title: "Review edited",
			buttons: ['OK']
		});
		alert.present();
	}
	addReview(){
		var success  = this.editReviewAsync().then(()=> this.presentToast()).catch();
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
