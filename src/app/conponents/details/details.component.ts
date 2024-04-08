import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  country !: OlympicCountry;
  medalsPerYear: { x: number, y: number }[] = [];
  canDisplay: boolean = false;
  totalMedals: number = 0;
  totalAthletes: number = 0;
  private destroy$ = new Subject<boolean>();
  constructor(private route: ActivatedRoute, private olympicService: OlympicService, private router: Router) { }

  ngOnInit(): void {

    //Get the id
    const countryId = this.route.snapshot.params['countryId'];
    this.getCountryInfos(countryId);
  }

  //Get country informations
  getCountryInfos(countryId: string) {

    this.olympicService.loadInitialData().pipe(takeUntil(this.destroy$)).subscribe(countries => {
      this.country = countries.find(c =>c.id === parseInt(countryId,0)) as OlympicCountry;
      this.prepareMedalData(this.country.participations);
      this.updateChartOptions();
      this.fillLabels();
      this.canDisplay = true;
    });
    
  }


  chartOptions = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: ""
    },
    axisX: {
      valueFormatString: "YYYY",
      intervalType: "year",
      interval: 1
    },
    axisY: {
      title: "Medals",
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: "pointer",
      itemclick: function (e: any) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
        e.chart.render();
      }
    },
    data: [{
			type: "line",
			xValueFormatString: "YYYY",
			yValueFormatString: "# Medals",
			dataPoints: [] as { x: Date, y: number }[]
		}]
  };

  // Prepare medal data from participation data
  prepareMedalData(participations: Participation[]) {

    //Put data in map
    participations.forEach(participation => {
      this.medalsPerYear.push({ x: participation.year, y: participation.medalsCount });
    });

  }

  //update chart data
  updateChartOptions() {
    this.chartOptions.data = [{
			type: "line",
			xValueFormatString: "YYYY",
			yValueFormatString: "# Medals",
			dataPoints: this.medalsPerYear.map(item => ({ x: new Date(item.x, 0, 1), y: item.y }))
		}]
    this.canDisplay = true;
    this.fillLabels();
  }

  fillLabels() {
    this.country.participations.forEach(participation => {
      this.totalAthletes += participation.athleteCount;
      this.totalMedals += participation.medalsCount;
    });
  }

  back() {
    this.router.navigate(['']);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}

