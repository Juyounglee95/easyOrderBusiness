import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import * as firebase from 'firebase';
import { FCM } from '@ionic-native/fcm';
import {GlobalvarsProvider} from "../providers/globalvars/globalvars";

export interface MenuItem {
    title: string;
    component: any;
    icon: string;
}
// Initialize Firebase
var config = {
	apiKey: "AIzaSyAQI9atTgFtDK5XTr23RcpsB-f9Gt8ngpo",
	authDomain: "easyordercustomer.firebaseapp.com",
	databaseURL: "https://easyordercustomer.firebaseio.com",
	projectId: "easyordercustomer",
	storageBucket: "easyordercustomer.appspot.com",
	messagingSenderId: "1063191754261"
};
// var secondaryAppConfig = {
// 	apiKey: "AIzaSyBWfY4XI0s2HzK2e-vo-hi-C1FA6tDMmBA",
// 	authDomain: "easyorderbusiness.firebaseapp.com",
// 	projectId: "easyorderbusiness",
// 	databaseURL: "https://easyordercustomer.firebaseio.com",
// 	storageBucket: "easyordercustomer.appspot.com"
// };

@Component({
    templateUrl: 'app.html'
})
export class foodIonicApp {
    @ViewChild(Nav) nav: Nav;

  	tabsPlacement: string = 'bottom';
  	tabsLayout: string = 'icon-top';

    rootPage: any = 'page-auth';
    showMenu: boolean = true;
    homeItem: any;
    initialItem: any;
    messagesItem: any;
    settingsItem: any;
    appMenuItems: Array<MenuItem>;
    yourRestaurantMenuItems: Array<MenuItem>;
    accountMenuItems: Array<MenuItem>;
    helpMenuItems: Array<MenuItem>;
	public secondary :any;
	public secondaryDatabase : any;
	public storeCollection: any;
	public storeCode: any;
	email:string='';
	public  db :any;

    constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private fcm: FCM, public global : GlobalvarsProvider) {
		firebase.initializeApp(config);
		firebase.auth().onAuthStateChanged((user)=>{
			if(user){
				this.rootPage = 'page-home';
				this.email=user.email;
				this.platform.ready().then(() => {
					this.db=firebase.firestore();
					this.fcm.getToken().then(token => {
						// Your best bet is to here store the token on the user's profile on the
						// Firebase database, so that when you want to send notifications to this
						// specific user you can do it from Cloud Functions.
					});
					var store_a = this.storeAsync().then(store_a=> this.storeCode = store_a).then(()=>{this.fcm.subscribeToTopic(this.storeCode);});
					this.fcm.onNotification().subscribe(data => {
						if (data.wasTapped) {
							console.log("Received in background");
						} else {
							console.log("Received in foreground");
						}
					});
					this.fcm.onTokenRefresh().subscribe(token => {
						console.log(token);
					});

					this.statusBar.overlaysWebView(false);
					this.splashScreen.hide();
				});
				if (!this.platform.is('mobile')) {
					this.tabsPlacement = 'top';
					this.tabsLayout = 'icon-left';
				}
			}else{
				this.rootPage = 'page-auth';
			}
		});

		// this.initializeApp();
        this.homeItem = { component: 'page-home' };
        this.messagesItem = { component: 'page-message-list'};


        this.appMenuItems = [
            // {title: 'Restaurants', component: 'page-restaurant-list', icon: 'home'},
             {title: 'Reviews', component: 'page-dish-list', icon: 'camera'},
            // {title: 'Nearby', component: 'page-nearby', icon: 'compass'},
            {title: 'Waiting', component: 'page-category', icon: 'albums'},
            {title: 'Latest Orders', component: 'page-orders', icon: 'list-box'},
            // {title: 'Cart', component: 'page-cart', icon: 'cart'},
			// {title: 'Favorite Restaurants', component: 'page-favorite-list', icon: 'heart'}
        ];

        this.yourRestaurantMenuItems = [
            {title: 'Register Restaurant', component: 'page-your-restaurant', icon: 'clipboard'}
        ];


        this.accountMenuItems = [
            {title: 'Login', component: 'page-auth', icon: 'log-in'},
            {title: 'My Account', component: 'page-my-account', icon: 'contact'},
            {title: 'Logout', component: 'page-auth', icon: 'log-out'},
        ];

        this.helpMenuItems = [
            {title: 'About', component: 'page-about', icon: 'information-circle'},
            {title: 'Support', component: 'page-support', icon: 'call'},
            {title: 'App Settings', component: 'page-settings', icon: 'cog'},
            // {title: 'Walkthrough', component: 'page-walkthrough', icon: 'photos'}
        ];

    }
	logout(){
		firebase.auth().signOut().then(function() {
			// Sign-out successful.
			console.log("logout");
		}).catch(function(error) {
			// An error happened.
			console.log("error");
		});
	}
	async  storeAsync(){
		let val = await this._store();
		return val;

	}

	_store():Promise<any> {
		return new Promise<any>(resolve => {
			var store='';
			this.storeCollection=this.db.collection('store');
			this.storeCollection.where("owner", "==", this.email)
				.onSnapshot(function (querySnapshot) {
						querySnapshot.forEach(function (doc) {
								store = doc.data().code
								//.log(store);
								resolve(store);
							}
						)
					}
				);
		})
	}
	// async checkoutAsync(){
	// 	let check = await this._check();
	// 	return check;
	// }
	// _check():Promise<any>{
	// 	return new Promise<any>(resolve => {
	// 		var success = "success";
	// 		var addDoc = this.db.collection('order').add({
    //
	// 			menu : this.names,
	// 			status : true,
	// 			table_num : this.table,
	// 			timestamp : this.date,
	// 			totalprice : this.totalprice,
	// 			user : firebase.auth().currentUser.email,
	// 			store_code : this.store
	// 		}).then(ref => {
	// 			resolve(success);
	// 			console.log('Added document with ID: ', ref.id);
	// 		});
    //
	// 		//   resolve(store);
	// 	})
	// }
    initializeApp() {
        this.platform.ready().then(() => {




			// this.db=firebase.firestore();
			// var user = firebase.auth().currentUser;



			// console.log(this.email);
			// firebase.auth().onAuthStateChanged(function(user) {
			// if(user!=null) {
			console.log(this.email)

			this.fcm.subscribeToTopic('abc');


				// let secondary = firebase.initializeApp(secondaryAppConfig, "secondary");
				// let secondaryDatabase = secondary.firestore();
                //
				// this.storeCollection = secondaryDatabase.collection("store");
				// var store_a = this.storeAsync().then(store_a => this.storeCode = store_a)
				// //.then(store_a=>{console.log("@@@@@@@@@@@@@@@@@@@@@", this.table, this.store)});;
				// 	.then(() => {
				// 		this.fcm.subscribeToTopic(this.storeCode);
				// 	});


				this.fcm.onNotification().subscribe(data => {
					if (data.wasTapped) {
						console.log("Received in background");
					} else {
						console.log("Received in foreground");
					}
				});
				this.fcm.onTokenRefresh().subscribe(token => {
					console.log(token);
				});


				// 	} else {
				// 		// No user is signed in.
			// }
			// });
				// this.email = user.email;
				// console.log(this.email);
			this.statusBar.overlaysWebView(false);
			this.splashScreen.hide();
        });
	    if (!this.platform.is('mobile')) {
	      this.tabsPlacement = 'top';
	      this.tabsLayout = 'icon-left';
	    }
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }
}
