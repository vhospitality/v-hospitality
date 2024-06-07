import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./progress.component.scss'],
})
export class ProgressComponent {
  @Input() progress = 0;
  constructor() {}
}
