import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CircleService {

  constructor() { }

  circle(dataCount,dataGoal) {
    let decimalCount = ( dataCount / 100);  //Mıknatıs geçis
    let decimalGoal = (dataGoal / 100 ); //Belirlenen hedef

    const ProgressBar = require('progressbar.js')
    var bar = new ProgressBar.Circle("#wheel", {
      strokeWidth: 8,
      easing: 'easeInOut',
      duration: 1400,
      color: '#a7ff83',
      trailColor: '#eee',
      trailWidth: 1,
      svgStyle: null,
     
      from: { color: '#a7ff83', width: 1 }, 
      to: { color: '#17b978', width: 3 },
      step: function(state, circle) {
        circle.path.setAttribute('stroke', state.color); 
        circle.path.setAttribute('stroke-width', state.width);
            
        var value = decimalCount;
        if (value < 1 ) {
          circle.setText("Başla");
        } else {
          circle.setText(value * 100);
        }
    
      }
    });
    bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
    bar.text.style.fontSize = '2rem';

    //animate'in içi her zaman 1 olmalı 
    //bu yüzden decimalgol değişkenine karşılık eksi bir değişken sürekli gelmeli
    let comp = (decimalGoal - 1);
    bar.animate((decimalGoal - comp) + (decimalCount - decimalGoal)); 


  }


















  startCircle() {
    let decimalVal = ( 92 / 100);
    let decimalGoal = ( 100 / 100);
   const  ProgressBar = require('progressbar.js')
var bar = new ProgressBar.Circle("#startCircle", {
  color: '#086972',
  strokeWidth: 3,
  duration: 2000,
  trailWidth: 0.5,
  easing: 'easeInOut',
  from: { color: '#a7ff83', width: 2}, 
  to: { color: '#a7ff83', width: 2 },

	step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);
      let value = (decimalVal);
      let lap =  circle.setText(value * 100);
  }
});
    bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
    bar.text.style.fontSize = '3rem';

  
    let comp = ( decimalGoal- 1)
    bar.animate( ( (decimalGoal - comp) + (decimalVal - decimalGoal) ) ); 

    
    
  }
}
