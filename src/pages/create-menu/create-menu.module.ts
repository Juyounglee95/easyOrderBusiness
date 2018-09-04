import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateMenuPage } from './create-menu';

@NgModule({
  declarations: [
    CreateMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateMenuPage),
  ],
	exports: [
	CreateMenuPage
]
})
export class CreateMenuPageModule {}
