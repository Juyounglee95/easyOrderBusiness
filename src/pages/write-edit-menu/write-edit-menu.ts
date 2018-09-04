import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import * as firebase from "firebase";
import 'firebase/firestore';

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
  constructor(public navCtrl: NavController, public navParams: NavParams ,private alertCtrl: AlertController) {
	  this.name = this.navParams.get("name");
	  this.price = this.navParams.get("price");
	  this.code = this.navParams.get("code")
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
			var reviewRef = this.db.collection('menu').where("store_code", "==", code).onSnapshot(querySnapshot => {
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
		var success  = this.editMenuAsync().then(()=> this.presentAlert()).then(()=>{this.navCtrl.push('page-home');}).catch();
		console.log("result:",success);

	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad WriteEditMenuPage');
  }

}
