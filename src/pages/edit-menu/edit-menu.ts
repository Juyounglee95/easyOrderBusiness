import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import * as firebase from "firebase";
import 'firebase/firestore';
/**
 * Generated class for the EditMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
		name:'page-edit-menu'
	})
@Component({
  selector: 'page-edit-menu',
  templateUrl: 'edit-menu.html',
})
export class EditMenuPage {
	store : any;
	menu: any;
	time: any;
	date : any;
	code : any;
	id: any; //menuDoc_id
	menus :Array<any>=[];
	public  db = firebase.firestore();

  constructor(public navCtrl: NavController, public navParams: NavParams, private  alert: AlertController) {

	  this.id = this.navParams.get("id");
	  this.openMenus()
  }
	async getMenuAsync(){
		let text = await this._getMenu();
		return text;
	}
	_getMenu():Promise<any>{
		return new Promise<any>(resolve => {
			var text:Array<any>=[];

			var menuRef = this.db.collection('menu').where("owner_id", "==", firebase.auth().currentUser.email);
			var menuinfo = menuRef.get()
				.then(snapshot => {
					snapshot.forEach(doc => {
						text.push({
							price : doc.data().price,
							name : doc.data().menu,
							code: doc.data().store_code,
							id : doc.data().id
						})
					});
					console.log(text);
					resolve(text);
				})
				.catch(err => {
					console.log('Error getting documents', err);
				});

			//   resolve(store);
		})
	}

	openMenus(){
		var review_a = this.getMenuAsync().then(text=> this.menus= text).then(()=>console.log(this.menus));
	}
	editMenu(id){
		this.navCtrl.push('page-write-edit-menu',{
			'name': this.menus[id].name,
			'price': this.menus[id].price,
			'code': this.menus[id].code

		})
	}
	presentAlert(id) {

		let alert = this.alert.create({
			title: "Do you really want to delete the Menu?",
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
						this.deleteMenu(id)
					}
				}
			]
		});
		alert.present();
	}

	deleteMenu(id){
  		var docid = this.menus[id].id
		var reviewRef = this.db.collection('menu').where("id", "==", docid).onSnapshot(querySnapshot => {
			querySnapshot.docChanges.forEach(change => {
				const reviewid = change.doc.id;
				console.log(id,"$$$$$$$$$$$$$$$$$$");
				this.db.collection('menu').doc(reviewid).delete().then(()=>this.navCtrl.push('page-home')).catch(err=> console.log("error"));
			})
		})
	}

	// presentAlert2() {
    //
	// 	let alert = this.alert.create({
	// 		title: "Deleted Menu",
	// 		buttons: ["OK"]
	// 	});
	// 	alert.present();
	// }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditMenuPage');
  }

}
