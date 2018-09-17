import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventAddPage } from './event-add';

@NgModule({
  declarations: [
    EventAddPage,
  ],
  imports: [
    IonicPageModule.forChild(EventAddPage),
  ],
})
export class EventAddPageModule {}
