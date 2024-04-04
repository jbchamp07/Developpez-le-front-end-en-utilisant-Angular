import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { Input } from '@angular/core';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  @Input() OlympicCountries!: Observable<OlympicCountry[]>;
  totalParticipation: number = 0;

  constructor() { }

  ngOnInit(): void {
    // Souscrire à l'Observable OlympicCountries pour obtenir les valeurs         Calculer la participation totale
    this.OlympicCountries.subscribe((countries: OlympicCountry[]) => {
      countries.forEach((country: OlympicCountry) => {
        this.totalParticipation += country.participations.medalsCount;
        alert(country.participations.medalsCount);
      });
    });
    alert(this.totalParticipation);
    calculatePercent();
  }

  chartOptions = {
	  animationEnabled: true,
	  title: {
		text: "Medals per Country"
	  },
	  data: [{
		type: "pie",
		startAngle: -90,
		indexLabel: "{name}: {y}",
		yValueFormatString: "#,###.##'%'",
		dataPoints: [
		  { y: 14.1, name: "Toys" },
		  { y: 28.2, name: "Electronics" },
		  { y: 14.4, name: "Groceries" },
		  { y: 43.3, name: "Furniture" }
		]
	  }]
	}

}
function calculatePercent() {
  throw new Error('Function not implemented.');
}

