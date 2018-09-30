import { Component ,OnInit} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import * as firebase from "firebase";
import 'firebase/firestore';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
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
	public menuform : FormGroup;
  constructor(public loadingCtrl: LoadingController, public toastCtrl: ToastController,private _fb: FormBuilder,public navCtrl: NavController, public navParams: NavParams ,private alertCtrl: AlertController) {
	  this.code = this.navParams.get("code");
	  this.menuform = this._fb.group({


		  storecode: ['',
			  Validators.required
		  ],
		  menus : this._fb.array([
			  this.initmenu()
		  ])
	  });
  }

	initmenu():FormGroup {
  	return this._fb.group(
		{
			menuName :['', Validators.required],
			menuPrice :['', Validators.required]
		}
	);
	}
	addNewMenufield():void
	{
		const control =<FormArray>this.menuform.controls.menus;
		control.push(this.initmenu());
	}
	removeMenufield(i: number) : void
	{
		const control =<FormArray>this.menuform.controls.menus;
		control.removeAt(i);
	}
	manage(val : any) : void
	{
		console.dir(val);
	}

	onModelChange(event){
		console.log(event);
	}
	async addMenuAsync(data){
		let menus = await this._addmenu(data);
		return menus;
	}

	_addmenu(data):Promise<any>{
		return new Promise<any>(resolve => {
			var success = "success";
			let menuvalue = data;

			this.date = new Date().toUTCString();
			// this.id = this.id.toString();
			var addDoc = this.db.collection('menu').add({
				// orderDoc_id : this.id,
				menu : menuvalue.menuName,
				price : parseInt(menuvalue.menuPrice),
				time: this.date,
				owner_id : firebase.auth().currentUser.email,
				// store_name:this.store,
				store_code : this.storecode,
				id:"",
				status :0
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
	presentToast() {
		// send booking info
		let loader = this.loadingCtrl.create({
			content: "Please wait..."
		});
		// show message
		let toast = this.toastCtrl.create({
			showCloseButton: true,
			cssClass: 'profiles-bg',
			message: 'Your menus are registered!',
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
	addMenu(){
	//	var success  = this.addMenuAsync().then(()=> this.presentAlert()).then(()=>{this.navCtrl.push('page-home');}).catch();
		for(let i=0; i<this.menuform.controls.menus.value.length;i++ ){
			console.log("&&&&&", this.menuform.controls.menus.value[i]);
			var menuadd = this.addMenuAsync(this.menuform.controls.menus.value[i])
		}
		return this.presentToast();
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateMenuPage');
  }

}
