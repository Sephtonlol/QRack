import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonReorderGroup,
  ItemReorderEventDetail,
  IonSpinner,
} from '@ionic/angular/standalone';
import { StorageService } from '../services/storage.service';
import { Card } from '../interfaces/card';
import { CardComponent } from '../components/card/card.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    CardComponent,
    IonReorderGroup,
    IonSpinner,
  ],
})
export class HomePage {
  constructor(private storageService: StorageService) {}
  loaded = false;
  cards!: Card[];

  async handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
    this.loaded = false;
    this.cards = event.detail.complete(this.cards);
    this.cards = await this.storageService.reorder(this.cards);
    this.loaded = true;
  }

  async ionViewWillEnter() {
    this.loaded = false;
    this.cards = await this.storageService.getCards();
    this.cards.reverse();
    this.loaded = true;
  }
}
