import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonAlert,
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
    IonAlert,
  ],
})
export class CardPage implements OnInit {
  loaded = false;
  invalid = false;
  id!: string | null;
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
    this.id = this.route.snapshot.paramMap.get('id');

    if (!this.id) {
      throw new Error('No ID provided');
    }

    const card = await this.storageService.getCard(this.id);
    if (card) {
      this.generateImage(card);
    } else {
      throw new Error('Card not found');
    }
  }

  public deleteButtons = [
    {
      text: 'Cancel',
    },
    {
      text: 'OK',
      handler: () => {
        this.delete();
      },
    },
  ];

  private generateBarcode(): void {
    setTimeout(() => {
      this.loaded = true;
      try {
        if (this.card.number.length == 0) {
          this.invalid = true;
          console.error('No number provided');
        } else {
          JsBarcode('#img', this.card.number, {
            format: this.card.format,
            displayValue: false,
            height: this.card.number.length * 5 + 60,
          });
          this.invalid = false;
        }
      } catch (error) {
        this.invalid = true;
        console.error('Error generating barcode:', error);
      }
    }, 150);
  }

  private generateQRCode(): void {
    setTimeout(() => {
      this.loaded = true;
      try {
        const img = document.getElementById('img') as HTMLCanvasElement;
        if (this.card.number.length == 0) {
          this.invalid = true;
          console.error('No number provided');
        } else {
          QRCode.toCanvas(img, this.card.number, {
            errorCorrectionLevel: 'H',
            scale: 10,
          });
          this.invalid = false;
        }
      } catch (error) {
        this.invalid = true;
        console.error('Error generating qrcode:', error);
      }
    }, 150);
  }

  delete() {
    if (!this.id) {
      throw new Error('No key provided');
    }
    this.storageService.delete(this.id);
    this.router.navigate(['/home']);
  }
  editCard(name: string, number: string, format: string) {
    if (!this.id) {
      throw new Error('No key provided');
    }
    this.card.name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    this.card.number = number;
    this.card.format = format;
    this.card.key = this.id;
    this.storageService.setCard(this.card, Number(this.id));
    this.router.navigate(['/home']);
  }
  generateImage(card: Card): void {
    this.card = card;
    this.card.format = this.card.format ? this.card.format : 'QRCODE';

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
