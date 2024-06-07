import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-best-homes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './best-homes.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./best-homes.component.scss']
})
export class BestHomesComponent {

  collections: any[] = [
    {
      image: 'orange-diamond',
      title: 'Curated Luxury Collection',
      description:
        'Explore handpicked luxury properties across Africa for an unforgettable stay.',
    },
    {
      image: 'orange-bookmark',
      title: 'Seamless Booking',
      description:
        'Enjoy a user-friendly web app with effortless browsing, secure transactions, and 24/7 customer support.',
    },
    {
      image: 'orange-face-content',
      title: 'Personalized Experiences',
      description:
        'Elevate your getaway with tailored experiences and a dedicated concierge service.',
    },
  ];
}
