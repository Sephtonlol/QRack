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
} from '@ionic/angular/standalone';

import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

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
  ],
})
export class NewPage implements OnInit {
  @ViewChild('reader', { static: true }) reader!: ElementRef;
  @ViewChild(IonModal) modal!: IonModal;
  html5QrCode: Html5Qrcode | null = null;
  isScanning: boolean = false;

  cardName: string = '';
  cardNumber: string = '';
  format!: string;

  constructor() {}

  async test() {
    if (!this.html5QrCode) {
      this.html5QrCode = new Html5Qrcode(this.reader.nativeElement.id, {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.CODE_39,
        ],
        verbose: false,
      });
    }

    try {
      this.isScanning = true;
      const devices = await Html5Qrcode.getCameras();

      if (devices && devices.length) {
        const cameraId = devices[0].id;

        await this.html5QrCode.start(
          { deviceId: { exact: cameraId } },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          async (decodedText, decodedResult) => {
            this.cardNumber = decodedText;
            this.format = decodedResult.result.format?.toString() || '';
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

  confirm(name: string | undefined | null | number) {
    console.log(name);
    console.log(this.cardNumber);
    console.log(this.format);
  }

  ngOnInit() {}
}
