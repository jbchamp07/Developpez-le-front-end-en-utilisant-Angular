import { OlympicCountry } from "./Olympic";
import { Participation } from "./Participation";

export class OlympicsInfos implements OlympicCountry{
    id: number;
    country: string;
    participations: Participation[];
    percent: number;
    totalMedals: number;
    constructor(id: number, country: string, participations: Participation[]) {
        this.id = id;
        this.country = country;
        this.participations = participations;
        this.percent = 0;
        this.totalMedals = 0;
    }
}