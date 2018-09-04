import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WriteEditMenuPage } from './write-edit-menu';
import {EditMenuPage} from "../edit-menu/edit-menu";

@NgModule({
  declarations: [
    WriteEditMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(WriteEditMenuPage),
  ],
	exports: [
		WriteEditMenuPage
	]
})
export class WriteEditMenuPageModule {}
