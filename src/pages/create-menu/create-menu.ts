import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import * as firebase from "firebase";
import 'firebase/firestore';

/**
 * Generated class for the CreateMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
	name:'page-create-menu'
})
@Component({
  selector: 'page-create-menu',
  templateUrl: 'create-menu.html',
})
export class CreateMenuPage {
	date : any;
	store : any;
	menuprice: any;
	menuname : any;
	storecode : any;
	code : any;
	id: any;
	public  db = firebase.firestore();

  constructor(public navCtrl: NavController, public navParams: NavParams ,private alertCtrl: AlertController) {
	  this.code = this.navParams.get("code");

  }
	onModelChange(event){
		console.log(event);
	}
	async addMenuAsync(){
		let menus = await this._addmenu();
		return menus;
	}

	_addmenu():Promise<any>{
		return new Promise<any>(resolve => {
			var success = "success";
			this.date = new Date().toUTCString();
			// this.id = this.id.toString();
			var addDoc = this.db.collection('menu').add({
				// orderDoc_id : this.id,
				menu : this.menuname,
				price : this.menuprice,
				time: this.date,
				owner_id : firebase.auth().currentUser.email,
				// store_name:this.store,
				store_code : this.storecode,
				id:""
			}).then(function(docRef) {

				console.log("Document written with ID: ", docRef.id);
				//	var docid = docRef.id.toString()
				var setid = docRef.update({
					id: docRef.id.toString()
				})
				resolve(success);
				console.log('Added document');
			});

			//   resolve(store);
		})
	}
	// updateMenu() {
    //
	// 	var orderRef = this.db.collection('order').where("id", "==", this.id).onSnapshot(querySnapshot => {
	// 		querySnapshot.docChanges.forEach(change => {
    //
	// 			const fooId = change.doc.id
	// 			this.db.collection('order').doc(fooId).update({review: true});
	// 			// do something with foo and fooId
    //
	// 		})
	// 	});
	// }

	presentAlert() {

		let alert = this.alertCtrl.create({
			title: "Menu added",
			buttons: ['OK']
		});
		alert.present();
	}
	addMenu(){
		var success  = this.addMenuAsync().then(()=> this.presentAlert()).then(()=>{this.navCtrl.push('page-home');}).catch();

	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateMenuPage');
  }

}
