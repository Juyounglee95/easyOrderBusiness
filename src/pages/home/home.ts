import { Component } from '@angular/core';
import {
	IonicPage,
	NavController,
	AlertController,
	MenuController,
	ToastController,
	PopoverController,
	ModalController, IonicModule, Platform,
} from 'ionic-angular';
import {RestaurantService} from '../../providers/restaurant-service-mock';
import * as firebase from "firebase";
import 'firebase/firestore';
import {GlobalvarsProvider} from "../../providers/globalvars/globalvars";
import {FCM} from "@ionic-native/fcm";
import {catchError} from "rxjs/operators";
import {_catch} from "rxjs/operator/catch";
import { IamportService } from 'iamport-ionic-kcp';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HttpClient, HttpHeaders} from "@angular/common/http";

var secondaryAppConfig = {
	apiKey: "AIzaSyBWfY4XI0s2HzK2e-vo-hi-C1FA6tDMmBA",
	authDomain: "easyorderbusiness.firebaseapp.com",
	projectId: "easyorderbusiness",
	databaseURL: "https://easyordercustomer.firebaseio.com",
	storageBucket: "easyordercustomer.appspot.com"
};
var config = {
	apiKey: "AIzaSyBWfY4XI0s2HzK2e-vo-hi-C1FA6tDMmBA",
	authDomain: "easyorderbusiness.firebaseapp.com",
	databaseURL: "https://easyorderbusiness.firebaseio.com",
	projectId: "easyorderbusiness",
	storageBucket: "easyorderbusiness.appspot.com",
	messagingSenderId: "448152825562"
};

@IonicPage({
	name: 'page-home',
	segment: 'home',
	priority: 'high'
})

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  restaurants: Array<any>;
  searchKey: string = "";
  yourLocation: string = "Gongreung 58 130, Seoul";
  email:string='';
  store:string='';
	public storeCollection: any;
	public secondary : any;
	public secondaryDatabase :any;
	public orders : Array<any>=[];
	public orderCollection: any;
	public  db = firebase.firestore();
	status = '0';
  constructor(public iamport: IamportService, private theInnAppBrowser : InAppBrowser,public http: HttpClient, public navCtrl: NavController, public platform : Platform,private fcm: FCM,public menuCtrl: MenuController, public popoverCtrl: PopoverController, public locationCtrl: AlertController, public modalCtrl: ModalController, public toastCtrl: ToastController, public service: RestaurantService) {
		this.menuCtrl.swipeEnable(true, 'authenticated');
		this.menuCtrl.enable(true);
	  	firebase.auth().onAuthStateChanged((user)=>{
		  if(user){
			  this.email=user.email;
		  }else{
		  }
	  });
		// this.getOrder();
		// this.findAll();
	this.getregister();
	 this.initializeApp();
	  // this.platform.ready().then(() => {
	  //
		//   this.secondaryDatabase = firebase.firestore(firebase.app('secondary'));
		//   this.storeCollection = this.secondaryDatabase.collection("store");
		//   var store_a = this.storeAsync().then(store_a => this.store = store_a);
		//   this.getOrder();
	  // });
  }
	pay(event) {
		this.iamport.payment("imp94907252",  {
			pay_method : "card",
			merchant_uid : this.email + new Date().getTime(),
			name : "주문명:결제테스트",
			amount : 50000,
			app_scheme : "ionickcp" //플러그인 설치 시 사용한 명령어 "ionic cordova plugin add cordova-plugin-iamport-kcp --variable URL_SCHEME=ionickcp" 의 URL_SCHEME 뒤에 오는 값을 넣으시면 됩니다.
		}).then((response)=> {
			//	console.log(response);
			if ( response.isSuccess() ) {
				//TODO : 결제성공일 때 처리
				var res = this.updateownerAsync(this.email).then(status => this.status= status).then(()=>this.updatestoreAsync(this.email)).then(
					()=>this.presentAlert()
				).then(()=>this.navCtrl.push('page-home'))

				console.log(response);

			}else{

			}
		})
			.catch((err)=> {
				alert(err)
			})
		;
	}
	presentAlert() {

		let alert = this.locationCtrl.create({
			title: "Payment Success",
			buttons: ['OK']
		});
		alert.present();
	}
	async  updateownerAsync(email){
		let val = await this._updateowner(email);
		return val;

	}
	_updateowner(email):Promise<any> {
		return new Promise<any>(resolve => {
			var status ='2'
			var orderRef = this.db.collection('owner').where("email", "==", email).onSnapshot(querySnapshot => {
				querySnapshot.docChanges.forEach(change => {

					const fooId = change.doc.id
					this.db.collection('owner').doc(fooId).update({status:'2'});
					// do something with foo and fooId

				})
				resolve(status);
			});


		})
	}
	async  updatestoreAsync(email){
		let val = await this._updatestore(email);
		return val;

	}
	_updatestore(email):Promise<any> {
		return new Promise<any>(resolve => {
			var status ='2'
			var orderRef = this.db.collection('store').where("owner", "==", email).onSnapshot(querySnapshot => {
				querySnapshot.docChanges.forEach(change => {

					const fooId = change.doc.id
					this.db.collection('store').doc(fooId).update({service_status:'2'});
					// do something with foo and fooId

				})
				resolve(status);
			});


		})
	}


	getregister(){
  	this.platform.ready().then(()=>{
		var res = this.resAsync().then(status=> this.status = status)})
  }
	  async  resAsync(){
		  let val = await this._res();
		  return val;

	  }
	_res():Promise<any> {
		return new Promise<any>(resolve => {
			var res:any;
			var resRef = this.db.collection('owner');
			var allres = resRef.get()
				.then(snapshot => {
					snapshot.forEach(doc => {
						if(doc.data().email == this.email){
						 res = doc.data().status
						}

					});
					console.log(res);
						resolve(res);
				}

				)
				.catch(err => {
					res='0'
					resolve(res);
					console.log('Error getting documents', err);
				});

		})
  }
  register_service(){
	  this.navCtrl.push('page-register-service', {email : this.email});
  }
	initializeApp() {
		this.platform.ready().then(() => {
			var store_a = this.storeAsync().then(store_a=> this.store = store_a).then(()=>{this.getOrder();})
	// 		}
		});
    //
	}
	async  storeAsync(){
		let val = await this._store();
		return val;

	}
	_store():Promise<any> {
		return new Promise<any>(resolve => {
			var store:Array<any>=[];
			this.storeCollection=this.db.collection('store');
			this.storeCollection.where("owner", "==", this.email)
				.onSnapshot(function (querySnapshot) {
						querySnapshot.forEach(function (doc) {
								store.push(doc.data().code);
								resolve(store);
							}
						)
					}
				);
		})
	}
	getOrder(){
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
			this.orderCollection = this.db.collection("order");
			console.log(this.store);
			var orderRef = this.orderCollection.where("store_code", "==", this.store[0]);
			console.log(orderRef)
			var orderInfo = orderRef.get()
				.then(snapshot => {
					snapshot.forEach(doc => {

						order.push({
							menu : doc.data().menu,
							totalPrice : doc.data().totalprice,
							status : doc.data().status,
							tableNum : doc.data().table_num,
							timeStamp : doc.data().timestamp,
							user : doc.data().user,
							store_code:doc.data().store_code
						});
					});
					resolve(order);
				})
				.catch(err => {
					console.log('Error getting documents', err);
				});
		})
	}

	confirm(index : any){
  	this.orders[index].status=false;
	var orderRef = this.orderCollection.where("timestamp", "==", this.orders[index].timeStamp).onSnapshot(querySnapshot => {
		querySnapshot.docChanges.forEach(change => {
			if (change.type === 'added' && change.doc._document.hasLocalMutations) {
				const fooId = change.doc.id
				this.orderCollection.doc(fooId).update({status : false});
				// do something with foo and fooId
			}
		})
	});
	// console.log(orderRef);
	// var a = orderRef.update({status:false});
	}
///get doc
// 	const usersRef = db.collection('users').doc('id')
//
// 	usersRef.get()
// .then((docSnapshot) => {
// 	if (docSnapshot.exists) {
// 	usersRef.onSnapshot((doc) => {
// 	// do stuff with the data
// });
// } else {
// 	usersRef.set({...}) // create the document
// }
// });












  openRestaurantListPage(proptype) {
  	this.navCtrl.push('page-restaurant-list', proptype);
  }

  openRestaurantFilterPage() {
    let modal = this.modalCtrl.create('page-restaurant-filter');
    modal.present();
  }

  openNearbyPage() {
    this.navCtrl.push('page-nearby');
  }

  openOrders() {
    this.navCtrl.push('page-orders');
  }

  openCart() {
    this.navCtrl.push('page-cart');
  }

	openRestaurantDetail(restaurant: any) {
  	this.navCtrl.push('page-restaurant-detail', {
			'id': restaurant.id
		});
	}

  openSettingsPage() {
  	this.navCtrl.push('page-settings');
  }

  openNotificationsPage() {
  	this.navCtrl.push('page-notifications');
  }

  openCategoryPage() {
    this.navCtrl.push('page-restaurant-list');
  }

	onInput(event) {
	    this.service.findByName(this.searchKey)
	        .then(data => {
	            this.restaurants = data;
	        })
	        .catch(error => alert(JSON.stringify(error)));
	}

	onCancel(event) {
	    this.findAll();
	}

	findAll() {
	    this.service.findAll()
	        .then(data => this.restaurants = data)
	        .catch(error => alert(error));
	}

  alertLocation() {
    let changeLocation = this.locationCtrl.create({
      title: 'Change Location',
      message: "Type your Address to change restaurant list in that area.",
      inputs: [
        {
          name: 'location',
          placeholder: 'Enter your new Location',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Change',
          handler: data => {
            console.log('Change clicked', data);
            this.yourLocation = data.location;
            let toast = this.toastCtrl.create({
              message: 'Location was change successfully',
              duration: 3000,
              position: 'top',
              closeButtonText: 'OK',
              showCloseButton: true
            });
            toast.present();
          }
        }
      ]
    });
    changeLocation.present();
  }

  presentNotifications(myEvent) {
    console.log(myEvent);
    let popover = this.popoverCtrl.create('page-notifications');
    popover.present({
      ev: myEvent
    });
  }

  ionViewWillEnter() {
      this.navCtrl.canSwipeBack();
  }

}
