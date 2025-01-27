import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ScreenBrightness } from '@capacitor-community/screen-brightness';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Capacitor } from '@capacitor/core';
import { NavigationEnd, Router } from '@angular/router';
import { App } from '@capacitor/app';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, NavigationComponent],
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(1, () => {
      if (this.router.url === '/home') App.minimizeApp();
      else this.router.navigate(['/home']);
    });
  }

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
      ScreenBrightness.setBrightness({ brightness: -1 });
    }
  }
}
