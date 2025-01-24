import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'new',
    loadComponent: () => import('./new/new.page').then((m) => m.NewPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'card/:id',
    loadComponent: () => import('./card/card.page').then((m) => m.CardPage),
  },
];
