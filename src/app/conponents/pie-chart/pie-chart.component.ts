import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, count, map, takeUntil } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { Input } from '@angular/core';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicsInfos } from 'src/app/core/models/OlympicInfos';
import { Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit,OnDestroy {

  olympicCountries$!: Observable<OlympicCountry[]>;
  totalParticipation: number = 0;
  countryInfos: OlympicsInfos[] = [];
  canDisplay: boolean = false;
  nbOfJOs: number = 0;
  nbOfCountries: number = 0;
  private destroy$!: Subject<boolean>;

  constructor(private router: Router,private olympicService: OlympicService) { }

  ngOnInit(): void {
    // Souscrire à l'Observable OlympicCountries pour obtenir les valeurs         Calculer la participation totale
    this.destroy$ = new Subject<boolean>();
    this.olympicCountries$ = this.olympicService.getOlympics();
    this.calculatePercent();

  }

  // worked
  chartOptions = {
    animationEnabled: true,
    title: {
      //text: "Medals per Country"
    },
    data: [{
      type: "pie",
      startAngle: -90,
      indexLabel: "{name}: {y}",
      click: (e: { dataPoint: { name: string; }; }) =>{
        if (e && e.dataPoint) {
          this.chartClicked(e.dataPoint.name);
        }
      },
      dataPoints: [] as { y: number; name: string; }[]
    }],
  }

  calculatePercent() {
    //Mappage add attributes to interface
    this.olympicCountries$.pipe(takeUntil(this.destroy$)).subscribe((countries: OlympicCountry[]) => {
      countries.forEach((country: OlympicCountry) => {
        this.countryInfos.push(new OlympicsInfos(country.id, country.country, country.participations));
      });

      //Calculate the number of participations of each country
      this.countryInfos.forEach((country: OlympicsInfos) => {
        country.participations.forEach((participation: Participation) => {
          country.totalMedals += participation.medalsCount;
        });
        this.canDisplay = true;
      });
      this.updateChart();
    });
  }

  updateChart() {
    const dataPoints = this.countryInfos.map(country => ({ y: country.totalMedals, name: country.country }));
    this.chartOptions.data[0].dataPoints = dataPoints;
    this.fillLabels();
  }

  chartClicked(countryName: string) {
    const country = this.countryInfos.find(c => c.country === countryName);
    //Config route with countryId
    this.router.navigate(['country/', country?.id]);
  }

  fillLabels() {
    let years: number[] = [];
    this.countryInfos.forEach(country => {
      country.participations.forEach(participation => {
        if (!years.find(y => y == participation.year)) {
          years.push(participation.year);
        }
      });
    });
    this.nbOfJOs = years.length;
    this.nbOfCountries = this.countryInfos.length;
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}


