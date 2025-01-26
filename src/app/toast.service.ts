import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private activeToast: HTMLIonToastElement | null = null;

  constructor(private toastController: ToastController) {}

  async showToast(
    message: string,
    color: string = 'success',
    duration: number = 1500
  ) {
    // Dismiss any active toast before showing a new one
    if (this.activeToast) {
      await this.activeToast.dismiss();
    }

    this.activeToast = await this.toastController.create({
      message,
      duration,
      color,
      position: 'top',
      cssClass: 'toast-text',
    });

    // Present the toast
    await this.activeToast.present();

    // Reset `activeToast` once it's dismissed
    this.activeToast.onDidDismiss().then(() => {
      this.activeToast = null;
    });
  }
}
