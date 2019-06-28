import { Sports } from "./../../models/sports";
import { Component, OnInit } from "@angular/core";
import { NavController } from '@ionic/angular';


@Component({
  selector: "app-sports",
  templateUrl: "./sports.page.html",
  styleUrls: ["./sports.page.scss"]
})
export class SportsPage implements OnInit {
  constructor(public navCtrl: NavController) {}

 

  ngOnInit() {}

  goToGoal() {
    this.navCtrl.navigateForward('/goals')
  }
}
