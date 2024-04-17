import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { OlympicCountry } from '../models/Olympic';
import * as fs from 'fs';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {

  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<OlympicCountry[]>([]);
  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
        tap((value) => this.olympics$.next(value)),
        catchError((error) => {
            console.error('Error loading initial data:', error);
            // Inform the user
            alert("Une erreur est survenue lors du chargement des données.");
            this.addErrorToLogFile(error);
            return of([]);
        })
    );
  }
  addErrorToLogFile(error: Error) {
    const logFilePath: string = "./assets/LogFile.txt";
    const errorMessage: string = `${new Date().toISOString()} : ${error.message}\n`;
    fs.appendFile(logFilePath,errorMessage,(err: any) =>{
      if (err) {
        console.error("Une erreur s'est produite lors de l'écriture dans le log file :", err);
        return;
    }
    console.log("L'erreur a été ajoutée au log file");
    });
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getCountryById(id: number): Observable<OlympicCountry | undefined>{
    return this.olympics$.pipe(
      map(olympics => olympics.find(country => country.id === id))
    );
  }
}

