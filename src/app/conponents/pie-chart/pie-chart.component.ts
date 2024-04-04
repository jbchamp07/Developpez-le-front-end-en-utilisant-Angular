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
    // const labels = ['USA', 'Canada', 'UK', 'Australia']; // Exemple de noms de pays
    // const data = [20, 30, 15, 35]; // Exemple de valeurs pour chaque pays
    let countries: String[];
    this.OlympicCountries.pipe(
      map(c => c.map(c => c.country))
    ).subscribe(noms => {
      countries = noms; // Attribuer les noms extraits à votre variable listeNoms
      alert(countries);
    });

    const ctx = document.getElementById('pieChart') as HTMLCanvasElement | null;
    if (ctx) {
      const myPieChart = new Chart(ctx, {
        type: 'pie',
        data:{

        }
      });
    }

    // const ctx = document.getElementById('pieChart') as HTMLCanvasElement | null;
    // if (ctx) {
    //   const myPieChart = new Chart(ctx, {
    //     type: 'pie',
    //     data: {
    //       labels: labels,
    //       datasets: [{
    //         data: data,
    //         backgroundColor: [
    //           'rgba(255, 99, 132, 0.7)',
    //           'rgba(54, 162, 235, 0.7)',
    //           'rgba(255, 206, 86, 0.7)',
    //           'rgba(75, 192, 192, 0.7)'
    //         ],
    //         borderColor: [
    //           'rgba(255, 99, 132, 1)',
    //           'rgba(54, 162, 235, 1)',
    //           'rgba(255, 206, 86, 1)',
    //           'rgba(75, 192, 192, 1)'
    //         ],
    //         borderWidth: 1
    //       }]
    //     },
    //     options: {
    //       responsive: true,
    //       maintainAspectRatio: false
    //     }
    //   });
    // } else {
    //   console.error("Element with ID 'pieChart' not found.");
    // }
  }

}
