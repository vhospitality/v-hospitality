import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { SeoService } from 'src/app/global-services/seo.service';
import { baseUrl } from 'src/environments/environment';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-cookie-policy',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    BackButtonComponent,
  ],
  templateUrl: './cookie-policy.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./cookie-policy.component.scss'],
})
export class CookiePolicyComponent {
  datas: any = [
    {
      title: 'Introduction',
      content: [
        {
          title: '',
          content: [
            {
              name: 'This Cookie Policy explains the use of cookies and similar technologies ("Cookies") on our website    v-hospitality.com, operated by V-hospitality ("we", "us", or "our"). By using our website, you consent to the use of Cookies as described in this Policy.',
            },
          ],
        },
      ],
    },
    //
    {
      title: 'What are Cookies?',
      content: [
        {
          title: '',
          content: [
            {
              name: 'Cookies are small text files that are stored on your device (computer, smartphone, tablet, etc.) when you visit certain web pages. They are widely used to make websites work or to improve the efficiency of a website, as well as to provide reporting information and assist with personalized advertising.',
            },
            {
              name: 'Cookies set by the website owner (in this case v-hospitality) are called “first party cookies.” Cookies set by parties other than the website are called “third party cookies.” Third party cookies enable third party features or functionality to be provided on or through the website e.g. advertising, interactive content and analytics. The parties that set these third -party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.',
            },
          ],
        },
      ],
    },
    //
    {
      title: 'How We Use Cookies',
      content: [
        {
          title: 'We use Cookies for the following purposes:',
          content: [
            {
              name: 'Essential Cookies: These Cookies are necessary for the functioning of our website. They enable you to navigate our website and use its features. Without these Cookies, services you have asked for (such as remembering your login details) cannot be provided.',
            },
            {
              name: 'Analytical/Performance Cookies: These Cookies allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it. This helps us to improve the way our website works, for example, by ensuring that users are finding what they are looking for easily.',
            },
            {
              name: 'Functionality Cookies: These Cookies are used to recognize you when you return to our website. This enables us to personalize our content for you, greet you by name, and remember your preferences (for example, your choice of language or region).',
            },
            {
              name: 'Advertising Cookies: These Cookies are used to deliver advertisements that are more relevant to you and your interests. They are also used to limit the number of times you see an advertisement and help measure the effectiveness of the advertising campaign. They are usually placed by advertising networks with our permission. They remember that you have visited a website and this information is shared with other organizations such as advertisers.',
            },
          ],
        },
      ],
    },
    //
    {
      title: 'Your Choices Regarding Cookies',
      content: [
        {
          title: '',
          content: [
            {
              name: 'You can choose to enable or disable Cookies in your internet browser. Most internet browsers automatically accept Cookies, but you can usually modify your browser setting to decline Cookies if you prefer. If you choose to decline Cookies, you may not be able to fully experience the interactive features of our website.',
            },
          ],
        },
      ],
    },
    {
      title: 'Changes to This Cookie Policy',
      content: [
        {
          title: '',
          content: [
            {
              name: 'You can choose to enable or disable Cookies in your internet browser. Most internet browsers automatically accept Cookies, but you can usually modify your browser setting to decline Cookies if you prefer. If you choose to decline Cookies, you may not be able to fully experience the interactive features of our website.',
            },
          ],
        },
      ],
    },
    {
      title: 'Contact Information:',
      content: [
        {
          title: '',
          content: [
            {
              name: "For privacy-related inquiries or concerns, users can contact V-Hospitality's Data Protection Officer at [support@v-hospitality.com] or contact us at ",
            },
            {
              name: 'V-hospitality',
            },
            {
              name: '11b Vanern Crescent Maitama Abuja',
            },
            {
              name: 'Abuja FCT 900271',
            },
            {
              name: 'Nigeria',
            },
            {
              name: 'Phone: (+234) 9029921966',
            },
          ],
        },
      ],
    },
  ];

  constructor(private seo: SeoService) {
    this.seo.updateSeoTags({
      title: 'Cookie Policy' + ' - ' + baseUrl.feDomain,
    });
  }
}
