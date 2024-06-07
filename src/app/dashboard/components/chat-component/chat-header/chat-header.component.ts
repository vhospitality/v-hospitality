import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { baseUrl } from '../../../../../environments/environment';

@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [CommonModule, LazyLoadImageModule],
  templateUrl: './chat-header.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./chat-header.component.scss'],
})
export class ChatHeaderComponent {
  @Input() currentUser: any;
  @Input() listingDetails: any;
  defaultImage: string = baseUrl.defaultImage;
}
