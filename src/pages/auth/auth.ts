import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IonicPage, NavController, AlertController, ToastController, MenuController } from 'ionic-angular';
import * as firebase from 'firebase';

@IonicPage({
	name: 'page-auth',
	segment: 'auth',
	priority: 'high'
})

@Component({
	selector: 'page-auth',
	templateUrl: 'auth.html'
})
export class AuthPage implements OnInit {
	public onLoginForm: FormGroup;
	public onRegisterForm: FormGroup;
	auth: string = "login";

	constructor(private _fb: FormBuilder, public nav: NavController, public forgotCtrl: AlertController, public menu: MenuController, public toastCtrl: ToastController) {
		this.menu.swipeEnable(false);
		this.menu.enable(false);
	}

	ngOnInit() {
		this.onLoginForm = this._fb.group({
			email: ['', Validators.compose([
				Validators.required
			])],
			password: ['', Validators.compose([
				Validators.required
			])]
		});

		this.onRegisterForm = this._fb.group({
			fullName: ['', Validators.compose([
				Validators.required
			])],
			phone_number: ['', Validators.compose([
				Validators.required
			])],
			email: ['', Validators.compose([
				Validators.required
			])],
			password: ['', Validators.compose([
				Validators.required
			])]
		});
	}

	// go to register page
	// register() {
	//   this.nav.setRoot(RegisterPage);
	// }

	// login and go to home page
	private account : any = {
		email : '',
		password : '',
		name : '',
		phoneNumber : ''
	}
	private log : any = {
		email : '',
		password : ''
	}
	signup(){
		firebase.auth().createUserWithEmailAndPassword(this.account.email, this.account.password).then((result)=>{
			console.log(result);
			var user = firebase.auth().currentUser;

			user.updateProfile({
				displayName: this.account.name,
				photoURL: ""
			}).then(function() {
				console.log("signup success");
				// Update successful.
			}).catch(function(error) {
				console.log("error");
				// An error happened.
			});
			// this.nav.setRoot('page-home');
		}).catch((error) =>{
			let alert = this.forgotCtrl.create({
				title: 'Register failed',
				subTitle: 'Please enter correct information',
				buttons: ['OK']
			});
			alert.present();
		});
	}
	login() {
		firebase.auth().signInWithEmailAndPassword(this.log.email, this.log.password).then((result)=>{
			console.log(result);
		}).catch((error)=>{
			let alert = this.forgotCtrl.create({
				title: 'Login failed',
				subTitle: 'Please enter correct ID & PW',
				buttons: ['OK']
			});
			alert.present();
			// ...
		});
	}

	forgotPass() {
		let forgot = this.forgotCtrl.create({
			title: 'Forgot Password?',
			message: "Enter you email address to send a reset link password.",
			inputs: [
				{
					name: 'email',
					placeholder: 'Email',
					type: 'email'
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
					text: 'Send',
					handler: data => {
						console.log('Send clicked');
						let toast = this.toastCtrl.create({
							message: 'Email was sended successfully',
							duration: 3000,
							position: 'top',
							cssClass: 'dark-trans',
							closeButtonText: 'OK',
							showCloseButton: true
						});
						toast.present();
					}
				}
			]
		});
		forgot.present();
	}

}
