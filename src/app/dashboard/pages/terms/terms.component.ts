import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { SeoService } from 'src/app/global-services/seo.service';
import { baseUrl } from 'src/environments/environment';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    BackButtonComponent,
  ],
  templateUrl: './terms.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./terms.component.scss'],
})
export class TermsComponent {
  datas: any = [
    {
      title: ' Booking and Cancellation Policies:',
      content: [
        {
          title: 'Guests',
          content: [
            {
              name: 'Guests agree to adhere to the specified cancellation policies outlined during the booking process.              ',
            },
            {
              name: ' Cancellation timelines for refunds are clearly communicated.   ',
            },
          ],
        },

        {
          title: 'Hosts',
          content: [
            {
              name: 'Hosts must comply with the cancellation policies and provide valid reasons for cancellations under extenuating circumstances.',
            },
            {
              name: 'Non-compliance may result in penalties, including loss of hosting privileges.',
            },
          ],
        },
      ],
    },
    //
    {
      title: ' Payment and Fees:',
      content: [
        {
          title: 'Guests',
          content: [
            {
              name: 'Guests agree to pay the total booking amount plus any additional fees specified during the reservation process.',
            },
            {
              name: 'Payment is processed through V-Hospitality securely.',
            },
          ],
        },

        {
          title: 'Hosts',
          content: [
            {
              name: 'Hosts receive payment through V-Hospitality, minus any applicable fees.',
            },
            {
              name: 'Fees are transparently communicated, and any changes are notified in advance.',
            },
          ],
        },
      ],
    },
    //
    {
      title: ' Property Guidelines and Responsibilities:',
      content: [
        {
          title: 'Guests',
          content: [
            {
              name: 'Guests agree to respect the property and adhere to any specific guidelines provided by the host.',
            },
            {
              name: 'Any damages caused by guests are the responsibility of the guest to rectify.',
            },
          ],
        },

        {
          title: 'Hosts',
          content: [
            {
              name: 'Hosts agree to provide accurate property details and maintain the premises in a safe and habitable condition.',
            },
            {
              name: 'Any changes or issues with the property must be communicated promptly to the guest.',
            },
          ],
        },
      ],
    },
    //
    {
      title: 'Code of Conduct:',
      content: [
        {
          title: 'Guests',
          content: [
            {
              name: 'Guests agree to conduct themselves respectfully and not engage in any illegal or disruptive activities during their stay.',
            },
            {
              name: 'Complaints regarding guest behaviour may result in penalties, including eviction.',
            },
          ],
        },
        {
          title: 'Hosts',
          content: [
            {
              name: 'Hosts agree to treat guests with respect and provide a safe environment.',
            },
            {
              name: 'Discrimination against guests based on race, ethnicity, gender, or other factors is strictly prohibited.',
            },
          ],
        },
      ],
    },

    //
    {
      title: 'Privacy and Data Security:',
      content: [
        {
          title: 'Guests',
          content: [
            {
              name: 'Guests acknowledge that V-Hospitality collects and processes their data as outlined in the privacy policy.',
            },
            {
              name: 'Personal information is handled securely.',
            },
          ],
        },
        {
          title: 'Hosts',
          content: [
            {
              name: 'Hosts agree to the collection and use of their information for the purpose of facilitating bookings.',
            },
            {
              name: 'Sensitive information is handled with the utmost confidentiality.',
            },
          ],
        },
      ],
    },

    //
    {
      title: 'Dispute Resolution:',
      content: [
        {
          title: 'Guests',
          content: [
            {
              name: "Guests agree to communicate and attempt to resolve any issues with hosts before involving V-Hospitality's support.",
            },
            {
              name: "Formal disputes are handled through V-Hospitality's resolution centre.",
            },
          ],
        },
        {
          title: 'Hosts',
          content: [
            {
              name: 'Hosts agree to address guest concerns promptly and professionally.',
            },
            {
              name: 'V-Hospitality may mediate disputes and enforce resolutions based on the terms and conditions.',
            },
          ],
        },
      ],
    },

    //
    {
      title: 'Termination of Account:',
      content: [
        {
          title: 'Guests',
          content: [
            {
              name: 'V-Hospitality reserves the right to terminate a guest account for violations of terms and conditions.',
            },
          ],
        },
        {
          title: 'Hosts',
          content: [
            {
              name: 'V-Hospitality reserves the right to suspend or terminate host accounts for repeated policy violations.',
            },
          ],
        },
      ],
    },

    {
      title: 'Amendments to Terms and Conditions:',
      content: [
        {
          title: '',
          content: [
            {
              name: 'Both guests and hosts acknowledge that terms and conditions may be updated, and continued use of V-Hospitality constitutes acceptance of any changes.',
            },
          ],
        },
      ],
    },
  ];

  constructor(private seo: SeoService) {
    this.seo.updateSeoTags({
      title: 'Terms and Conditions' + ' - ' + baseUrl.feDomain,
    });
  }
}
