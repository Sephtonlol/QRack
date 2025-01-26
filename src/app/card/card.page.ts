import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonAlert,
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonRange,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Card, color } from '../interfaces/card';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
    IonRange,
  ],
})
export class CardPage implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
    private router: Router
  ) {}
  headerVisible: boolean = true;
  backButtonSubscription!: Subscription;
  loaded = false;
  invalid = false;
  id!: number | null;
  toastColor: 'primary' | 'danger' = 'primary';

  color: color = {
    red: 31,
    green: 31,
    blue: 31,
  };
  card: Card = {
    name: '',
    number: '',
    format: '',
    color: this.color,
  };

  async ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

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
      text: 'Confirm',
      handler: () => {
        this.delete();
      },
    },
  ];

  private generateBarcode(): void {
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
  }

  private generateQRCode(): void {
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
    this.card.color = this.card.color;
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

  get backgroundColor(): string {
    return `rgb(${this.card.color.red}, ${this.card.color.green}, ${this.card.color.blue})`;
  }

  onInputChange(name: string, number: string, format: string) {
    this.card = {
      name: name,
      number: number,
      format: format,
      color: this.card.color,
    };
    this.generateImage(this.card);
  }
  toggleHeader() {
    this.headerVisible = !this.headerVisible;
    console.log(this.headerVisible);
  }
  async ionViewWillEnter() {
    if (!this.id) {
      throw new Error('Id not found');
    }
    const card = await this.storageService.getCard(this.id);
    if (!card) {
      throw new Error('Card not found');
    }
    this.card = card;
    this.generateImage(this.card);
  }
}
