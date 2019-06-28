import { Injectable } from '@angular/core';
import { AlertController } from "@ionic/angular";
import { ToastController } from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    public alert: AlertController,
    public toast: ToastController,
  ) { }

  async errorAlert(error) {
    let alert = await this.alert.create({
      message: error,
      buttons: ['Dismiss'],
    });
    await alert.present();
  }

 async toastMessage(msj) {
    const toast = await this.toast.create({
      message: msj,
      duration: 2000,
      color:'dark'
    });
   toast.present();
  }

  
}
