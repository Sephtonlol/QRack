import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { StorageService } from '../services/storage.service';
import { Card } from '../interfaces/card';
import { CardComponent } from '../components/card/card.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, CardComponent],
})
export class HomePage {
  constructor(private storageService: StorageService) {}
  cards: Card[] = [];

  async ionViewWillEnter() {
    this.cards = await this.storageService.getCards();
  }
}
