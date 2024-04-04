import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  country !: OlympicCountry;
  constructor(private route: ActivatedRoute,private olympicService: OlympicService) { }

  ngOnInit(): void {
    const countryId = this.route.snapshot.params['countryId'];
    const foundCountry = this.olympicService.getCountryById(countryId);
    if(foundCountry)
    this.country = foundCountry;
  }

}
