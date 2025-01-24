import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Card } from '../interfaces/card';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButton,
  ],
})
export class CardPage implements OnInit {
  card: Card = {
    name: '',
    number: '',
    format: '',
  };

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
    private router: Router
  ) {}

  async ngOnInit() {
    console.log('ionViewWillEnter');

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      throw new Error('No ID provided');
    }

    const card = await this.storageService.getCard(id);

    if (card) {
      this.card = card;
      this.card.format = this.card.format ? this.card.format : 'EAN13';

      if (this.card.format === 'QRCODE') {
        this.generateQRCode();
      } else {
        this.generateBarcode();
      }
    } else {
      throw new Error('Card not found');
    }
  }

  private generateBarcode(): void {
    setTimeout(() => {
      JsBarcode('#img', this.card.number, {
        format: this.card.format,
      });
    }, 100);
  }

  private generateQRCode(): void {
    setTimeout(() => {
      const img = document.getElementById('img') as HTMLCanvasElement;
      QRCode.toCanvas(img, this.card.number, {
        errorCorrectionLevel: 'H',
      });
    }, 100);
  }

  delete() {
    if (!this.card.key) {
      throw new Error('No key provided');
    }
    this.storageService.deleteCard(this.card.key);
    this.router.navigate(['/home']);
  }
}
