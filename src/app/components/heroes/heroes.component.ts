import { Component, OnInit } from '@angular/core';
import { Hero } from '../../models/hero/hero';
import { HEROES } from '../../models/hero/mock-heroes';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {
  heroes = HEROES;
  selectedHero: Hero;

  constructor() {}

  ngOnInit() {}
  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }
}
