import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon, IonReorder } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { reorderThreeOutline } from 'ionicons/icons';
import { Card } from 'src/app/interfaces/card';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  imports: [RouterLink, IonReorder, IonIcon],
})
export class CardComponent implements OnInit {
  @Input() card!: Card;
  @Input() key!: string;

  constructor() {
    addIcons({ reorderThreeOutline });
  }
  get backgroundColor(): string {
    return `rgb(${this.card.color.red}, ${this.card.color.green}, ${this.card.color.blue})`;
  }
  ngOnInit() {}
}
