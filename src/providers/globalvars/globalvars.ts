import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the GlobalvarsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalvarsProvider {
	public myGlobalVar: any;
  constructor(public http: HttpClient) {
    console.log('Hello GlobalvarsProvider Provider');
  }
	setMyGlobalVar(value) {
		this.myGlobalVar = value;
	}

	getMyGlobalVar() {
		return this.myGlobalVar;
	}

}
