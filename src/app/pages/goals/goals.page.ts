import { ToastService } from './../../services/toast.service';
import { Component, OnInit } from "@angular/core";
import { Sports } from "./../../models/sports";
import { NavController } from "@ionic/angular";
import { Goal } from "./../../models/goal";
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: "app-goals",
  templateUrl: "./goals.page.html",
  styleUrls: ["./goals.page.scss"]
})
export class GoalsPage implements OnInit {
  sport: Sports[] = [];
  
  constructor(public navCtrl: NavController,private toast: ToastService, public router: Router) {}

  ngOnInit() {}

  select250() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: 250
      }
    };
    this.router.navigate(['tab1'], navigationExtras)
  
  }
  select1000() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: 1000
      }
    };
    this.router.navigate(['tab1'], navigationExtras)
  }
  select5000() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: 5000
      }
    };
    this.router.navigate(['tab1'], navigationExtras)
  }

  
}
