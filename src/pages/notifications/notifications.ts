import {Component} from "@angular/core";
import {IonicPage, NavController, ViewController, NavParams} from "ionic-angular";

@IonicPage({
	name: 'page-notifications'
})

@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html'
})

export class NotificationsPage {
	content: any;
	title: any;
	timeStamp: any;
  constructor(public navParams: NavParams,public navCtrl: NavController, public viewCtrl: ViewController) {
	  this.content= this.navParams.get("content");
	  this.title = this.navParams.get("title");
	  this.timeStamp = this.navParams.get("timeStamp");
  }

	  close() {
    this.viewCtrl.dismiss();
  }

  messages () {
  	this.navCtrl.push('page-message-list');
  }
}
