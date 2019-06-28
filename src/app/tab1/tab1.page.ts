import { BluetoothService } from "./../services/bluetooth.service";
import { Component, ViewChild, NgZone, ChangeDetectorRef } from "@angular/core";
import { BluetoothSerial } from "@ionic-native/bluetooth-serial/ngx";
import { ToastService } from "../services/toast.service";
import { Router, NavigationExtras,ActivatedRoute } from "@angular/router";
import { CircleProgressComponent } from "ng-circle-progress";
import { Events } from "@ionic/angular";
import { LoadingController } from "@ionic/angular";
import { NavController } from "@ionic/angular";
import { ActionSheetController } from "@ionic/angular";

interface pairedlist {
  class: number;
  id: string;
  address: string;
  name: string;
}

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"]
})
export class Tab1Page {
  @ViewChild("circleProgress") circleProgress: CircleProgressComponent;

  //bluetooth
  pairedList: pairedlist;
  unpairedDeviceID: number = 0;
  listToggle: boolean = false;
  pairedDeviceID: number = 0;
  dataSend: string = "";
  currentlyConnectedDevice: string;
  pairedName: string;
  buttons: any[] = [];

  //circle
  count: number;
  maxPercent: number = 0;
  sayac: number = 0;
  maxBoolean: Boolean;
  isMaxPercentDefined: Boolean = false;
  ngCircleOptions = {};

  //design
  isOkay: boolean = false;
  isCon: Boolean;
  toggle: any;
  findBool: Boolean = true;
  bluetoothList: Boolean = false;
  pairedDeviceList: Boolean = false;
  pairedDeviceCard: Boolean = false;
  ride: Boolean = false;
  loaderToShow: any;
  isReadyToStart: Boolean = false;

  constructor(
    public bt: BluetoothSerial,
    public toastAlert: ToastService,
    public router: Router,
    private zone: NgZone,
    public events: Events,
    private ref: ChangeDetectorRef,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public bluetoothService: BluetoothService,
    private activatedRoute: ActivatedRoute
  ) {

     this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        this.maxPercent = JSON.parse(params.special);
        
      }
    }); 

     this.events.subscribe("updateScreen", () => {
      this.zone.run(() => {
        let circleOptions = {
          percent: 0,
          radius: 100,
          //maxPercent: 100,
          space: -10, // şuanki ayarlarda en fazla -100 olmalı
          outerStrokeGradient: false, // true olduğu zaman mobilde stroke çıkmıyor, web versiyonda çıkıyor
          outerStrokeWidth: 10,
          outerStrokeColor: "#81fecc",
          outerStrokeGradientStopColor: "#35fdad",
          innerStrokeColor: "#fcfcfc",
          innerStrokeWidth: 10,
          renderOnClick: true,
          animation: true,
          title: [this.count],
          titleColor: "#cc81fe",
          titleFontWeight: "700",
          titleFontSize: "24",
          animateTitle: true,
          animationDuration: 1000,
          showSubtitle: false,
          showUnits: false,
          showBackground: false,
          lazy: false,
          responsive: true,
          startFromZero: true,
          subtitleFormat: "this.maximumPercent"
        };
        this.ngCircleOptions = circleOptions;
        if (this.maxPercent != 0) {
          this.maxBoolean = true;
        }
      });
    });

    this.events.subscribe("count", () => {
      this.zone.run(() => {
        let circleOptions = {
          percent: 0,
          radius: 100,
          //maxPercent: 100,
          space: -10, // şuanki ayarlarda en fazla -100 olmalı
          outerStrokeGradient: false, // true olduğu zaman mobilde stroke çıkmıyor, web versiyonda çıkıyor
          outerStrokeWidth: 10,
          outerStrokeColor: "#81fecc",
          outerStrokeGradientStopColor: "#35fdad",
          innerStrokeColor: "#fcfcfc",
          innerStrokeWidth: 10,
          renderOnClick: true,
          animation: false,
          title: [this.count],
          titleColor: "#cc81fe",
          titleFontWeight: "700",
          titleFontSize: "24",
          animateTitle: true,
          showSubtitle: false,
          showUnits: false,
          showBackground: false,
          lazy: false,
          responsive: true,
          startFromZero: true,
          subtitleFormat: "this.maximumPercent"
        };
        circleOptions.percent = this.circlePercentIncreaser(this.count);
        this.ngCircleOptions = circleOptions;
      });
      this.read();
      if (this.maxPercent == this.count) {
        this.isReadyToStart = true;
      }
    });

    this.events.subscribe("resetBluetooth", () => {
      this.zone.run(() => {});
    }); 
  }

  ngOnInit() {}

  circlePercentIncreaser(data: number) {
    return 100 * (data / this.maxPercent);
  }

  startRide() {
    this.ref.detectChanges();
    this.events.publish("updateScreen");
  }

  maximumPercent = (percent: number) => {
    return `${this.count}/${this.maxPercent}`;
  };

  setGoal(dailyGoal) {
    this.maxPercent = dailyGoal;

    this.isMaxPercentDefined = true;
  }

  //read in çağırılması
  timerCount() {
    setTimeout(() => {
      this.read();
    }, 1000);
  }

  //arduıno datasının okunduğu yer
  read() {
    setInterval(() => {
      this.bt.subscribeRawData().subscribe(data => {
        this.bt.read().then(veri => {
          this.count = veri;
          this.ref.detectChanges();
          this.events.publish("count");
        });
      });
    }, 1000);
  }

/*** ********* ********* ********* ************ BLUETOOTH  ******* ********* ********* ***********************/
  checkBluetoothEnabled() {
    this.bluetoothService
      .checkBluetoothEnabled()
      .then(success => {}, error => {});
  }

  public listPairedDevices() {
    let element = document.getElementById("bluetoothCircle");
    element.style.animation = "pulse 1s infinite";
    this.findDeviceLoader();
    this.bluetoothService.listPairedDevices().then(
      success => {
        this.hideLoader();
        this.pairedList = success;
        let container = [];
        container.push({
          text: JSON.stringify(this.pairedList.name),
          icon: "bluetooth",
          handler: this.onButtonClick.bind(
            this,
            JSON.stringify(this.pairedList.name)
          )
        });
        this.buttons = container;
        this.pairedActionSheet();
      },
      err => {
        this.toastAlert.errorAlert(
          "Lütfen Bluetoothun Açık Olduğundan Emin Olunuz"
        );
      }
    );
  }

  onButtonClick(value): any {
    this.pairedName = value;
    this.selectDevice();
  }

  async pairedActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Eşleşmiş Cihazlar",
      buttons: this.buttons
    });
    await actionSheet.present();
  }

  selectDevice() {
    let connectedDevice = this.pairedList[this.pairedDeviceID];
    let address = connectedDevice.address;
    let name = connectedDevice.name;
    this.currentlyConnectedDevice = name;
    this.connect(address);
  }

  connect(address) {
    this.connectingLoader(this.currentlyConnectedDevice);
    this.bluetoothService.connect(address).subscribe(
      success => {
        this.hideLoader();
        this.deviceConnected();
        this.toastAlert.toastMessage("Bağlantı Başarılı");
        let navigationExtras: NavigationExtras = {
          queryParams: {
            special: this.maxPercent
            
          }
        };
        this.toastAlert.toastMessage(this.maxPercent);
        this.router.navigate(['ride'], navigationExtras)
      
      },
      err => {
        this.toastAlert.errorAlert("Bağlantı Başarısız");
      }
    );
  }

  deviceConnected() {
    if (!this.bt.isConnected) {
      this.bt.subscribe("\n").subscribe(
        success => {
          this.handleData(success);
          this.toastAlert.toastMessage("Bağlantı Başarılı");
        },
        error => {
          this.toastAlert.errorAlert(error);
        }
      );
    }
  }

  deviceDisconnected() {
    this.bluetoothService.deviceDisconnected().then(success => {
      this.toastAlert.toastMessage("Bağlantı Kesildi");
    }).catch(err => {
      this.toastAlert.toastMessage("Bağlantı Kesildi");
    })
   
  }

  handleData(data) {
    this.toastAlert.toastMessage(data);
  }

  /******** ********* ********* ********** LOADER ******* ********* ********* ***********/

  findDeviceLoader() {
    this.loaderToShow = this.loadingController
      .create({
        message: "Cihazlar Aranıyor",
        spinner: "crescent"
      })
      .then(res => {
        res.present();

        res.onDidDismiss().then(dis => {});
      });
    this.hideLoader();
  }

  connectingLoader(name) {
    this.loaderToShow = this.loadingController
      .create({
        message: name + " Bağlanıyor",
        spinner: "crescent"
      })
      .then(res => {
        res.present();
        res.onDidDismiss().then(dis => {});
      });
    this.hideLoader();
  }

  hideLoader() {
    this.loadingController.dismiss();
  }

}
