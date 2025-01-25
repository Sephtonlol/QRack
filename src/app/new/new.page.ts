import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonModal,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonRange,
} from '@ionic/angular/standalone';

import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { StorageService } from '../services/storage.service';
import { Card, color } from '../interfaces/card';

import { Camera } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButton,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonRange,
  ],
})
export class NewPage implements OnInit {
  constructor(
    private router: Router,
    private storageService: StorageService,
    private platform: Platform
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(['/home']);
    });
  }
  @ViewChild('reader', { static: true }) reader!: ElementRef;
  @ViewChild(IonModal) modal!: IonModal;
  html5QrCode: Html5Qrcode | null = null;
  isScanning: boolean = false;

  color: color = {
    red: 31,
    green: 31,
    blue: 31,
  };
  card: Card = {
    name: '',
    number: '',
    format: 'QRCODE',
    color: this.color,
  };
  get backgroundColor(): string {
    return `rgb(${this.color.red}, ${this.color.green}, ${this.color.blue})`;
  }

  async startScan() {
    if (!this.html5QrCode) {
      this.html5QrCode = new Html5Qrcode(this.reader.nativeElement.id, {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.EAN_13,
        ],
        verbose: false,
      });
    }

    try {
      this.isScanning = true;
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length) {
        const mainRearCamera =
          devices.find(
            (device) =>
              device.label.toLowerCase().includes('facing back') &&
              device.label.includes('0')
          ) ||
          devices.find((device) =>
            device.label.toLowerCase().includes('facing back')
          );

        const cameraId = mainRearCamera ? mainRearCamera.id : devices[0].id;

        await this.html5QrCode.start(
          { deviceId: { exact: cameraId } },
          {
            fps: 20,
            qrbox: { width: 200, height: 200 },
            aspectRatio: 1 / 1,
          },
          async (decodedText, decodedResult) => {
            this.card.number = decodedText;
            this.card.format =
              decodedResult.result.format?.toString().replace(/_/g, '') || '';
            this.stopScan();
          },
          (errorMessage) => {}
        );
      }
    } catch (err) {
      console.error('Error starting QR code scan:', err);
    }
  }

  stopScan() {
    if (this.html5QrCode) {
      this.html5QrCode.stop().then(() => {
        this.isScanning = false;
      });
    }
  }

  async addCard(name: string, number: string, format: string) {
    this.card.name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    this.card.number = number;
    this.card.format = format;
    this.card.color = this.color;
    await this.storageService.setCard(this.card);
    this.card = {
      name: '',
      number: '',
      format: this.card.format,
      color: this.color,
    };
  }

  async ngOnInit() {
    if (Capacitor.getPlatform() !== 'web') {
      const status = await Camera.requestPermissions();
    }
  }
}
