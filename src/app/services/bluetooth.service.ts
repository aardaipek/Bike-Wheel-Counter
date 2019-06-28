import { Injectable } from "@angular/core";
import { BluetoothSerial } from "@ionic-native/bluetooth-serial/ngx";

interface pairedlist {
  class: number;
  id: string;
  address: string;
  name: string;
}

@Injectable({
  providedIn: "root"
})
export class BluetoothService {
  pairedList: pairedlist;
  unpairedDeviceID: number = 0;
  listToggle: boolean = false;
  pairedDeviceID: number = 0;
  dataSend: string = "";
  tempDeviceName: string;
  deviceName: string;
  constructor(public bt: BluetoothSerial) {}

  checkBluetoothEnabled() {
   return this.bt.isEnabled()
  }

  public listPairedDevices() {
   return this.bt.list()
  }

  /* selectDevice() {
    let connectedDevice = this.pairedList[this.pairedDeviceID];
    let address = connectedDevice.address;
    this.connect(address);
  } */

  connect(address) {
    return this.bt.connect(address)
  }

  deviceConnected() {
    if (!this.bt.isConnected) {
      this.bt.subscribe("\n").subscribe(
        success => {
          this.handleData(success);
        },
        error => {  
        }
      );
    }
  }

  deviceDisconnected() {
    return this.bt.disconnect();
  }

  handleData(data) {}
}
