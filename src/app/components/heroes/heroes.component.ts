import { Component, OnInit } from '@angular/core';
import { Hero } from '../../models/hero/hero';
import { HeroService } from '../../services/hero.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[];
  selectedHero: Hero;

  constructor(private heroService: HeroService) {}

  ngOnInit() {
    this.getHeroes();
  }
  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }
  getHeroes(): void {
    this.heroService
      .getHeroes()
      .pipe(delay(2000))
      .subscribe(heroes => (this.heroes = heroes));
  }
}
