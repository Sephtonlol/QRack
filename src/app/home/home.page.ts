import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { StorageService } from '../services/storage.service';
import { Card } from '../interfaces/card';
import { CardComponent } from '../components/card/card.component';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, CardComponent],
})
export class HomePage {
  constructor(
    private storageService: StorageService,
    private platform: Platform
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      App.exitApp();
    });
  }
  cards: Card[] = [];

  async ionViewWillEnter() {
    this.cards = await this.storageService.getCards();
  }
}
