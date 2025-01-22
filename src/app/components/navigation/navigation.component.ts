import { Component, OnInit } from '@angular/core';
import {
  IonIcon,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { addCircle, card } from 'ionicons/icons';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  imports: [IonIcon, IonTabBar, IonTabButton, IonTabs],
})
export class NavigationComponent implements OnInit {
  constructor() {
    addIcons({ card, addCircle });
  }

  ngOnInit() {}
}
