import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, Location, isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
})
export class BackButtonComponent {
  constructor(
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  back(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.location.back();
    }
  }
}
