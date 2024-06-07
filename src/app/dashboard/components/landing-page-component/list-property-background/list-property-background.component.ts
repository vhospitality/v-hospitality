import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list-property-background',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-property-background.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./list-property-background.component.scss'],
})
export class ListPropertyBackgroundComponent {}
