import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from 'src/app/interfaces/card';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  imports: [RouterLink],
})
export class CardComponent implements OnInit {
  @Input() card!: Card;
  @Input() key!: string;

  constructor() {}

  ngOnInit() {}
}
