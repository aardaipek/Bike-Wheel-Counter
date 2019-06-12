import { Component, ViewChild  } from "@angular/core";
import { BluetoothSerial } from "@ionic-native/bluetooth-serial/ngx";
import { ToastService } from '../services/toast.service';
import { CircleService } from '../services/circle.service';



@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"]
})
export class Tab1Page {


  pairedList: pairedlist;
  listToggle: boolean = false;
  pairedDeviceID: number = 0;
  dataSend: string = "";

  count:number;
  sayac:number=0;

  isOkay:boolean = false;
  progressBar = document.querySelector('.ion-progress-bar');
  goal:number;
  yourGoal:number;
  maxPercent:number;
  isCon:Boolean;

  constructor(
    public bt: BluetoothSerial,
    public toastAlert:ToastService,
    public circle: CircleService
  ) {}

  ngOnInit() {
    this.timerCount()
    //this.circle.startCircle()
    
  }


  startRide(){
    
  } 

  checkBluetoothEnabled() {
    this.bt.isEnabled().then(success => {
      this.listPairedDevices();
    }, error => {
      this.toastAlert.showError("Please Enable Bluetooth")
    });
  }

  listPairedDevices() {
    this.bt.list().then(success => {
      this.pairedList = success;
      this.listToggle = true;
    }, error => {
      this.toastAlert.showError("Please Enable Bluetooth")
      this.listToggle = false;
    });
  }

  selectDevice() {
    let connectedDevice = this.pairedList[this.pairedDeviceID];
    //Arduino ya bağlanmayı engelliyor.
    /* if (!connectedDevice.address) {
      this.showError('Select Paired Device to connect');
      return;
    } */
    let address = connectedDevice.address;
    let name = connectedDevice.name;

    this.connect(address);
    this.read();
  }

  connect(address) {
    // Attempt to connect device with specified address, call app.deviceConnected if success
    this.bt.connect(address).subscribe(success => {
      this.deviceConnected();
      let connected = true;
      this.isCon = connected;
      this.circle.circle(this.count,this.yourGoal);
      this.toastAlert.showToast("Successfully Connected");
    }, error => {
      this.toastAlert.showError("Error:Connecting to Device");
    });
  }

  deviceConnected() {
    // Subscribe to data receiving as soon as the delimiter is read
    if(!this.bt.isConnected){
      this.bt.subscribe('\n').subscribe(success => {
        this.handleData(success);
        this.read()
        this.isOkay = true
        
        this.toastAlert.showToast("Connected Successfullly");
      }, error => {
        this.toastAlert.showError(error);
      });
    }
   
  }

  deviceDisconnected() {
    // Unsubscribe from data receiving
    this.bt.disconnect();
    this.isCon = false;
    this.toastAlert.showToast("Device Disconnected");
  }

  handleData(data) {
    this.toastAlert.showToast(data);
  }
/*  //arduino ya bluetooth üzerinde komut gönderme
  sendData() {
    
    this.showToast(this.dataSend);

    this.bt.write(this.dataSend).then(success => {
      this.showToast(success);
    }, error => {
      this.showError(error)
    });
  } */
 
  
  timerCount() {
    setInterval(this.read,600)
  }

  read() {
     this.bt.subscribeRawData().subscribe(data => {
       this.bt.read().then(veri => {
        this.count = veri
        /*  if(this.count < 1){
           let mess = "<p>Pedal çevirmeye başla</p>"
           let label = $(".count1");
           $(label).append(mess)
         }else {
            this.count = veri
         } */
       })
     })
     
     /* this.bt.read().then(data => {
       this.count = data
     }) */
  }

  setGoal(goal) {
    this.yourGoal = goal;
    this.maxPercent = this.yourGoal;
  }

}
interface pairedlist {
  "class": number,
  "id": string,
  "address": string,
  "name": string
}
