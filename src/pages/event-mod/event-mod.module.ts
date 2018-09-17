import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventModPage } from './event-mod';

@NgModule({
  declarations: [
    EventModPage,
  ],
  imports: [
    IonicPageModule.forChild(EventModPage),
  ],
})
export class EventModPageModule {}
