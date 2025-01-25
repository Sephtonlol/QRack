import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ScreenBrightness } from '@capacitor-community/screen-brightness';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Capacitor } from '@capacitor/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, NavigationComponent],
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}
  async ngOnInit(): Promise<void> {
    if (Capacitor.getPlatform() !== 'web') {
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.onRouteChange(event.urlAfterRedirects);
        });
      await ScreenOrientation.lock({ orientation: 'portrait' });
    }
  }
  onRouteChange(url: string) {
    console.log('Router changed to:', url);
    if (url.includes('card')) {
      ScreenBrightness.setBrightness({ brightness: 1 });
    } else {
      ScreenBrightness.setBrightness({ brightness: 0.5 });
    }
  }
}
