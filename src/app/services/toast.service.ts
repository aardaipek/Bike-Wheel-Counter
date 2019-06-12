import { Injectable } from '@angular/core';
import { AlertController } from "@ionic/angular";
import { ToastController } from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    public alert: AlertController,
    public toast: ToastController
  ) { }


  async congrat() {
    const toast = await this.toast.create({
      message: 'Tebrikler 100',
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  async showError(error) {
    let alert = await this.alert.create({
      message: error,
      buttons: ['Dismiss']
    });
    await alert.present();
  }

 async showToast(msj) {
    const toast = await this.toast.create({
      message: msj,
      showCloseButton: true,
      closeButtonText: 'Ok',
      duration: 4000
    });
   toast.present();
  }

}
