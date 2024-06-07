import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {}
