import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Card } from '../interfaces/card';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

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
    IonSpinner,
    IonInput,
    IonSelect,
    IonSelectOption,
  ],
})
export class CardPage implements OnInit {
  loaded = false;
  card: Card = {
    name: '',
    number: '',
    format: '',
  };

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
    private router: Router,
    private platform: Platform
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(['/home']);
    });
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      throw new Error('No ID provided');
    }

    const card = await this.storageService.getCard(id);
    if (card) {
      this.generateImage(card);
    } else {
      throw new Error('Card not found');
    }
  }

  private generateBarcode(): void {
    setTimeout(() => {
      this.loaded = true;
      JsBarcode('#img', this.card.number, {
        format: this.card.format,
      });
    }, 150);
  }

  private generateQRCode(): void {
    setTimeout(() => {
      console.log('Generating QR Code');
      this.loaded = true;
      const img = document.getElementById('img') as HTMLCanvasElement;
      QRCode.toCanvas(img, this.card.number, {
        errorCorrectionLevel: 'H',
      });
    }, 150);
  }

  delete() {
    if (!this.card.key) {
      throw new Error('No key provided');
    }
    this.storageService.deleteCard(this.card.key);
    this.router.navigate(['/home']);
  }
  editCard(name: string, number: string, format: string) {
    this.card.name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    this.card.number = number;
    this.card.format = format;
    this.storageService.setCard(this.card, Number(this.card.key));
  }
  generateImage(card: Card): void {
    this.card = card;
    this.card.format = this.card.format ? this.card.format : 'EAN13';

    if (this.card.format === 'QRCODE') {
      this.generateQRCode();
    } else {
      this.generateBarcode();
    }
  }
  onInputChange(name: string, number: string, format: string) {
    this.card = {
      name: name,
      number: number,
      format: format,
    };
    this.generateImage(this.card);
  }
}
