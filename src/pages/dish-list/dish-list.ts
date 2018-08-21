import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {DishService} from '../../providers/dish-service-mock';
import * as firebase from "firebase";
import 'firebase/firestore';

@IonicPage({
	name: 'page-dish-list',
	segment: 'dish-list'
})

@Component({
	selector: 'page-dish-list',
	templateUrl: 'dish-list.html'
})
export class DishListPage {
	dishes: Array<any>=[];
	orders: Array<any>=[];
	stores: Array<any>=[];
	code : Array<any>=[];
	public reviewCollection :any;
	public storeCollection : any;
	public  db = firebase.firestore();
	public user:any;
	store_code : any;
	reviews : Array<any>=[];
	constructor(public navCtrl: NavController, public dishService: DishService) {
		//this.dishes = this.dishService.findAll();
		this.openReviewList();
	}
	//

	async storeAsync(){
		let storelist = await this._codelist();
		return storelist;
	}

	_codelist():Promise<any>{
		return new Promise<any>(resolve => {
			var store_code: any;
			this.user = firebase.auth().currentUser.email;
			this.storeCollection = this.db.collection("store");
			this.user = this.user.toString();
			var orderRef = this.storeCollection.where("owner", "==", this.user);
			var orderinfo = orderRef.get()
				.then(snapshot => {
					snapshot.forEach(doc => {
						store_code = doc.data().code;
					});
					resolve(store_code);
				})
				.catch(err => {
					console.log('Error getting documents', err);
				});

			//   resolve(store);
		})
	}


	async reviewListAsync(code){
		let reviewlist = await this._reviewlist(code);
		return reviewlist;
	}
	_reviewlist(code):Promise<any>{
		return new Promise<any>(resolve => {
				var reviews: Array<any>=[];
			//	var store_code : any;
				//this.user = firebase.auth().currentUser.email;
				//this.storeCollection = this.db.collection("store");
				//this.user = this.user.toString();

				// console.log(code);
				var reviewRef = this.db.collection("review").where("store_code", "==", code);
				var storeinfo = reviewRef.get()
					.then(snapshot => {
						snapshot.forEach(doc => {

							reviews.push({
								content : doc.data().content,
								menu : doc.data().menu,
								star : doc.data().star,
								time : doc.data().time,
								user_id : doc.data().user_id
							})

						});
						//console.log(store);
						resolve(reviews);

					})
					.catch(err => {
						console.log('Error getting documents', err);
					});




				// resolve();


				//   resolve(store);
			}
		)
	}



	openReviewList(){
		var menu_a = this.storeAsync().then(code=> this.store_code= code)
			.then(()=>this.reviewListAsync(this.store_code))
			.then((reviews)=> this.reviews = reviews)
			.catch();

		// this.user = firebase.auth().currentUser.email;
		//  console.log(this.user);
	}
	// openDishDetail(dish) {
	//     // this.navCtrl.push('page-dish-detail', {
	//    //   'id': dish.id
	//    // });
	// }

}
