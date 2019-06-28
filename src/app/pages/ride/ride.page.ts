import { BluetoothService } from "./../../services/bluetooth.service";
import { Component, OnInit,NgZone,ChangeDetectorRef,ViewChild } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { BluetoothSerial } from "@ionic-native/bluetooth-serial/ngx";
import { Events } from "@ionic/angular";
import { CircleProgressComponent } from "ng-circle-progress";
import { Goal } from "./../../models/goal";


@Component({
  selector: "app-ride",
  templateUrl: "./ride.page.html",
  styleUrls: ["./ride.page.scss"]
})
export class RidePage implements OnInit {

  @ViewChild("circleProgress") circleProgress: CircleProgressComponent;
  count: number;
  maxPercent: number = 0;
  sayac: number = 0;
  ngCircleOptions = {};

  isReadyToStart: Boolean = false;

  goals: Goal[] = [];


  constructor(
    private bluetoothService: BluetoothService,
    public router: Router,
    public btSerial: BluetoothSerial,
    private zone: NgZone,
    private ref: ChangeDetectorRef,
    public events: Events,
    private activatedRoute: ActivatedRoute
  ) 
  {
    this.activatedRoute.queryParams.subscribe(params => {
        this.maxPercent = JSON.parse(params.special);
    });

    //circle ilk yüklenme
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
          innerStrokeColor: "#dde7f6",
          innerStrokeWidth: 10,
          renderOnClick: true,
          animation: false,
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
       
      });
    });
    //yeni parametre ile sürekli yenilenmesi
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
          innerStrokeColor: "#dde7f6",
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
  }

  ngOnInit() {
    this.read()
    this.ref.detectChanges();
    this.events.publish("updateScreen")
  }

  ionViewDidLeave() {
    this.read()
    this.ref.detectChanges();
    this.events.publish("updateScreen")
  }


  timerCount() {
    setTimeout(() => {
      this.read();
    }, 1000);
  }
 
  //arduıno datasının okunduğu yer
  read() {
    setInterval(() => {
      this.btSerial.subscribeRawData().subscribe(data => {
        this.btSerial.read().then(veri => {
          this.count = veri;
          this.ref.detectChanges();
          this.events.publish("count");
        });
      });
    }, 1000);
  }

  maximumPercent = () => {
    return `${this.count}/${this.maxPercent}`;
  };

  circlePercentIncreaser(data: number) {
    return 100 * (data / this.maxPercent);
  }

  disconnect() {
    this.bluetoothService.deviceDisconnected();
    this.router.navigateByUrl("/tab1");
  }
}
