import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { Observable, map } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { Input } from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  @Input() OlympicCountries!: Observable<OlympicCountry[]>;

  constructor() { }

  ngOnInit(): void {

    this.createPieChart();

  }
  createPieChart() {

    let countries: String[];
    this.OlympicCountries.pipe(
      map(c => c.map(c => c.country))
    ).subscribe(noms => {
      countries = noms; // Attribuer les noms extraits à votre variable listeNoms
    });

    
  }

}
