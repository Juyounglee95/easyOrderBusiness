import {Component} from '@angular/core';
import {
	IonicPage,
	Config,
	NavController,
	NavParams,
	ToastController,
	ModalController,
	AlertController, Platform
} from 'ionic-angular';
import {RestaurantService} from '../../providers/restaurant-service-mock';
import leaflet from 'leaflet';

import * as firebase from "firebase";
import 'firebase/firestore';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@IonicPage({
	name: 'page-restaurant-list',
	segment: 'restaurant-list'
})

@Component({
	selector: 'page-restaurant-list',
	templateUrl: 'restaurant-list.html'
})
export class RestaurantListPage {
	orders: Array<any> = [];
	public store : string='';
	public table: any;
	public menuCollection: any;
	public  db = firebase.firestore();
	waitingNumber=0;
	owner:string='';
	order:string='';
	total:number=0;
	names:string='';
	date:string='';
	num2:number=0;

	restaurants: Array<any>;
	searchKey: string = "";
	viewMode: string = "list";
	proptype: string;
	from: string;
	map;
	markersGroup;

	public storeCollection: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public service: RestaurantService, public platform : Platform, public toastCtrl: ToastController, public modalCtrl: ModalController, public config: Config, private alertCtrl: AlertController,  private http: HttpClient) {
		this.platform.ready().then(() => {var store_a = this.storeAsync().then(store=> this.store = store).then(()=>{this.start();})});
		// console.log(this.proptype);
	}
	async  storeAsync(){
		let val = await this._store();
		return val;
	}
	_store():Promise<any> {
		return new Promise<any>(resolve => {
			var store1: any;
			this.storeCollection=this.db.collection('store');
			this.storeCollection.where("owner", "==", firebase.auth().currentUser.email)
				.onSnapshot(function (querySnapshot) {
						querySnapshot.forEach(function (doc) {
								store1 = doc.data().code;
							}
						)
					resolve(store1);
					}
				);
		})
	}
	start(){
			var abc =this.startAsync().then(num2 => {
				console.log(num2);
				this.waitingNumber = num2});
	}
	async startAsync(){
		let check = await this._start();
		return check;
	}
	_start():Promise<any>{
		return new Promise<any>(resolve => {
			this.db.collection(this.store).get().then(function(querySnapshot) {
				let a : number = querySnapshot.size;
				resolve(a);
			});
		})
	}

	waiting(){
		if(this.waitingNumber!=0){
			var abc =this.checkoutAsync().then(num => {
				this.num2=num;
				var wait = this.waitAsync(this.num2).then(wm => {
					this.waitingNumber=wm;
				})
			});
		}
	}
	async checkoutAsync(){
		let check = await this._check();
		return check;
	}
	_check():Promise<any>{
		return new Promise<any>(resolve => {
			let wm = 9999999;
			this.db.collection(this.store).get().then(function(querySnapshot) {
				querySnapshot.forEach(doc => {
					console.log(doc.data().order)
					if(wm>doc.data().order){
						wm = doc.data().order;
					}
				});
				resolve(wm);
			});
		});
	}
	async waitAsync(num : number){
		let wait = await this._wait(num);
		return wait;
	}
	push(fooUser){
		let body = {
			"notification": {
				"title": "Waiting is done! Come to the restaurant!",
				"body": "Waiting is done! Come to the restaurant!",
				"sound": "default",
				"click_action": "FCM_PLUGIN_ACTIVITY",
				"icon": "fcm_push_icon"
			},
			"data": {},
			"to": "/topics/" + fooUser,
			"priority": "high",
			"restricted_package_name": ""
		}
		let options = new HttpHeaders().set('Content-Type', 'application/json');
		this.http.post("https://fcm.googleapis.com/fcm/send", body, {
			headers: options.set('Authorization', 'key=AAAA94sqthU:APA91bHKb0t-b2rI3Z5OGu8fIYiOUmtOD--7gj4lBX5y7l8N418XFG3Qjmjo5UWU5kq1-kriF6S6A2smWcacheDof_vfqrw-jM_5DzSWhNEEkM4iX4LbyNelSefU8SyQEVpZJj_cid3t'),
		}).subscribe();
	}
	_wait(num : number):Promise<any>{
		return new Promise<any>(resolve => {
			var orderRef = this.db.collection(this.store).where("order", "==", num).onSnapshot(querySnapshot => {
				if(querySnapshot.size>0) {
					querySnapshot.docChanges.forEach(change => {
						const fooId = change.doc.id
						const fooUser = change.doc.data().user
						this.db.collection(this.store).doc(fooId).delete().then(()=>{this.push(fooId)}).then(()=>{
							let num
							num = this.waitingNumber-1;
							resolve(num);
						});
						// do something with foo and fooId
					});
				}
			});
		});
	}
}
