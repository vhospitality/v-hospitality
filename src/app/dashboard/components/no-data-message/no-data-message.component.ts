import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-no-data-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './no-data-message.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./no-data-message.component.scss'],
})
export class NoDataMessageComponent {
  @Input() message: any;
}
