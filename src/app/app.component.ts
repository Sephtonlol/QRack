import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ScreenBrightness } from '@capacitor-community/screen-brightness';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Capacitor } from '@capacitor/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, NavigationComponent],
})
export class AppComponent implements OnInit {
  private navigationStack: string[] = [];

  constructor(private router: Router, private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(1, () => {
      if (this.router.url === '/home') {
        this.navigationStack = [];
      }
      if (this.navigationStack.length > 1) {
        this.navigationStack.pop();
        const lastPage = this.navigationStack[this.navigationStack.length - 1];
        this.router.navigate([lastPage]).then(() => {});
      } else {
        App.minimizeApp();
      }
    });
  }

  async ngOnInit(): Promise<void> {
    if (Capacitor.getPlatform() !== 'web') {
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.updateNavigationStack(event.urlAfterRedirects);
          this.onRouteChange(event.urlAfterRedirects);
        });

      await ScreenOrientation.lock({ orientation: 'portrait' });
    }
  }

  updateNavigationStack(url: string) {
    if (
      this.navigationStack.length === 0 ||
      this.navigationStack[this.navigationStack.length - 1] !== url
    ) {
      this.navigationStack.push(url);
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
