import { Component, OnInit } from '@angular/core';
import { Observable, count, map } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { Input } from '@angular/core';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicsInfos } from 'src/app/core/models/OlympicInfos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  @Input() olympicCountries!: Observable<OlympicCountry[]>;
  totalParticipation: number = 0;
  oCountries: OlympicCountry[] = [];
  countryInfos: OlympicsInfos[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Souscrire à l'Observable OlympicCountries pour obtenir les valeurs         Calculer la participation totale

    this.calculatePercent();


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
      //yValueFormatString: "#,###.##'%'",
      dataPoints: [] as { y: number; name: string; }[]
    }],
    click: (event: any) => this.chartClicked(event)
  }

  calculatePercent() {
    //Mappage add attributes to interface
    this.olympicCountries.subscribe((countries: OlympicCountry[]) => {
      countries.forEach((country: OlympicCountry) => {
        this.countryInfos.push(new OlympicsInfos(country.id, country.country, country.participations));
      });

      //Calculate the number of participations of each country
      this.countryInfos.forEach((country: OlympicsInfos) => {
        country.participations.forEach((participation: Participation) => {
          country.totalMedals += participation.medalsCount;
        });
        
      });
      this.updateChart();
    });
  }

   updateChart() {
     const dataPoints = this.countryInfos.map(country => ({ y: country.totalMedals, name: country.country }));
     this.chartOptions.data[0].dataPoints = dataPoints;
   }

   chartClicked(event: any) {

    if (event.dataPoint) {
      const countryName = event.dataPoint.name;
      const country = this.countryInfos.find(c => c.country === countryName);
      
        //Config route with object
        this.router.navigate(['country/', country]);
      }
    }
    methodeTEST(){
      const country = this.countryInfos.find(c => c.country === "Italy");
      this.router.navigate(['country', country?.id]);
    }
}


