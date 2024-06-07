import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { SeoService } from 'src/app/global-services/seo.service';
import { baseUrl } from 'src/environments/environment';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    BackButtonComponent,
  ],
  templateUrl: './privacy-policy.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent {
  datas: any = [
    {
      title: 'Introduction',
      content: [
        {
          title: '',
          content: [
            {
              name: 'This Privacy Policy outlines how ("V-Hospitality") collects, uses, shares, and protects user information.',
            },
          ],
        },
      ],
    },
    //
    {
      title: 'Information Collected:',
      content: [
        {
          title: 'Personal Information',
          content: [
            {
              name: 'Guests and hosts may provide personal information during account creation, bookings, and communication.',
            },
            {
              name: 'Examples include names, contact details, payment information, and identification documents.',
            },
          ],
        },

        {
          title: 'Automatically Collected Information:',
          content: [
            {
              name: 'V-Hospitality collects device information, IP addresses, and usage data for analytics and security purposes.',
            },
          ],
        },
      ],
    },
    //
    {
      title: 'Use of Information:',
      content: [
        {
          title: 'Guests',
          content: [
            {
              name: 'Personal information is used to facilitate bookings, process payments, and enhance the user experience.',
            },
            {
              name: 'Communication preferences and location data may be used to personalize recommendations.',
            },
          ],
        },

        {
          title: 'Hosts',
          content: [
            {
              name: 'Host information is used for verification, payment processing, and communication with guests.',
            },
            {
              name: 'Property details and location data are utilized to match hosts with potential guests.',
            },
          ],
        },
      ],
    },
    //
    {
      title: 'Data Security:',
      content: [
        {
          title:
            'V-Hospitality employs industry-standard security measures to protect user information.',
          content: [
            {
              name: 'Encryption techniques are used for data transmission.',
            },
            {
              name: 'Access controls and authentication mechanisms safeguard user accounts.',
            },
          ],
        },
      ],
    },

    //
    {
      title: 'Data Sharing:',
      content: [
        {
          title: 'With Other Users:',
          content: [
            {
              name: 'Guest and host information is shared between parties involved in a booking to facilitate communication and stay logistics.',
            },
          ],
        },
        {
          title: 'With Third-Party Service Providers:',
          content: [
            {
              name: 'Certain data may be shared with third-party service providers for payment processing, customer support, and analytics.',
            },
          ],
        },
        {
          title: 'Legal Compliance and Safety:',
          content: [
            {
              name: 'User information may be disclosed to comply with legal obligations, respond to legal requests, or protect the safety of users.',
            },
          ],
        },
      ],
    },

    //
    {
      title: 'Cookies and Tracking Technologies:',
      content: [
        {
          title: '',
          content: [
            {
              name: 'V-Hospitality uses cookies and similar technologies to enhance user experience and collect analytics data.',
            },
          ],
        },
      ],
    },

    //
    {
      title: 'User Controls:',
      content: [
        {
          title: '',
          content: [
            {
              name: 'Users can manage communication preferences, review and update personal information, and adjust privacy settings through V-Hospitality.',
            },
          ],
        },
      ],
    },
    //
    {
      title: "Children's Privacy:",
      content: [
        {
          title: '',
          content: [
            {
              name: 'V-Hospitality is not intended for individuals under the age of 18. Parents or guardians should monitor and control the use of V-Hospitality by minors.',
            },
          ],
        },
      ],
    },
    //
    {
      title: 'Changes to Privacy Policy:',
      content: [
        {
          title: '',
          content: [
            {
              name: 'Users will be notified of any changes to the Privacy Policy. Continued use of V-Hospitality after such changes constitutes acceptance of the updated policy.',
            },
          ],
        },
      ],
    },
    //
    {
      title: 'Contact Information:',
      content: [
        {
          title: '',
          content: [
            {
              name: "For privacy-related inquiries or concerns, users can contact V-Hospitality's Data Protection Officer at [admin2@v-hospitality.com].",
            },
          ],
        },
      ],
    },
  ];

  constructor(private seo: SeoService) {
    this.seo.updateSeoTags({
      title: 'Privacy Policy' + ' - ' + baseUrl.feDomain,
    });
  }
}
