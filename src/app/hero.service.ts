import { enableProdMode, isDevMode } from '@angular/core';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import 'file-saver';

@Injectable()
export class HeroService {
  
	private static heroesUrl : string;
	private static heroesUrlAction : string;
	
	private options : RequestOptions;
	private headers : Headers;
	
	constructor(private http: Http) 
	{ 
	  this.headers = new Headers();
      this.headers.append('Accept', 'application/json')
      this.headers.append('Content-Type', 'application/json');
      this.headers.append('Authorization', 'Basic ' + btoa("admin:admin"));
	  
	  this.options = new RequestOptions({ headers: this.headers, withCredentials: true });
	}
	
	public static initMode(prodMode: boolean): void {
	  if (prodMode)
	  {
	    enableProdMode();
	
		HeroService.heroesUrl = 'https://cloud.sibvisions.com/heroes/services/rest/Heroes/HeroesWorkScreen/data/heroes';  // URL to web api
		HeroService.heroesUrlAction = 'https://cloud.sibvisions.com/heroes/services/rest/Heroes/HeroesWorkScreen/action/';  // URL to web api
      }
	  else
	  {
  	    HeroService.heroesUrl = 'http://localhost/services/rest/Heroes/HeroesWorkScreen/data/heroes';  // URL to web api
	    HeroService.heroesUrlAction = 'http://localhost/services/rest/Heroes/HeroesWorkScreen/action/';  // URL to web api
	  }
	}

	getHeroes(): Promise<Hero[]> {
	  return this.http.get(HeroService.heroesUrl, this.options)
				 .toPromise()
				 .then(response => response.json() as Hero[])
				 .catch(this.handleError);
	}

	getHeroesSlowly(): Promise<Hero[]> {
	  return new Promise(resolve => {
	    // Simulate server latency with 2 second delay
	    setTimeout(() => resolve(this.getHeroes()), 2000);
	  });
	}

    getHero(id: number): Promise<Hero> {
      return this.getHeroes()
                 .then(heroes => heroes.find(hero => hero.ID === id));
    }
  
	update(hero: Hero): Promise<Hero> {
	  const url = `${HeroService.heroesUrl}/${hero.ID}`;
	  return this.http
		.put(url, JSON.stringify(hero), this.options)
		.toPromise()
		.then(() => hero)
		.catch(this.handleError);
	}  
  
	create(name: string): Promise<Hero> {
	  return this.http
		.post(HeroService.heroesUrl, JSON.stringify({NAME: name}), this.options)
		.toPromise()
		.then(res => res.json() as Hero)
		.catch(this.handleError);
	}  
	
	delete(id: number): Promise<void> {
	  const url = `${HeroService.heroesUrl}/${id}`;
	  return this.http.delete(url, this.options)
		.toPromise()
		.then(() => null)
		.catch(this.handleError);
	}	
  
	private handleError(error: any): Promise<any> {
	  console.error('An error occurred', error); // for demo purposes only
	  return Promise.reject(error.message || error);
	}  
	
    download(): void {
	  var optCopy = new RequestOptions({ headers: this.headers, withCredentials: true, responseType: ResponseContentType.Blob });
	
      this.http.post(HeroService.heroesUrlAction + 'createListReportHeroes', JSON.stringify([null, null]), optCopy)
				 .toPromise()
				 .then(response => { 
				   var blob = new Blob([response.blob()], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
				   saveAs(blob, 'report.xlsx'); 
				 })
				 .catch(this.handleError);	
  }
	
}
