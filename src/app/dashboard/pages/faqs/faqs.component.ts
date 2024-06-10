import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AccordionModule } from 'primeng/accordion';
import { SkeletonModule } from 'primeng/skeleton';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  tap,
} from 'rxjs';
import { baseUrl } from '../../../../environments/environment';
import { HttpService } from '../../../global-services/http.service';
import { SeoService } from '../../../global-services/seo.service';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ToggleNavService } from '../../dashboard-service/toggle-nav.service';
import { EscapeHtmlPipe } from '../../pipes/escape-html.pipe';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    HeaderComponent,
    FooterComponent,
    AccordionModule,
    SkeletonModule,
    FormsModule,
    EscapeHtmlPipe,
    BackButtonComponent,
  ],
  templateUrl: './faqs.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./faqs.component.scss'],
})
export class FaqsComponent implements AfterViewInit {
  @ViewChild('input') input: ElementRef | any;
  faqs: any;
  faqsSearch: any;
  loadingfaq: boolean = false;

  constructor(
    private httpService: HttpService,
    private service: ToggleNavService,
    private seo: SeoService
  ) {
    let faqs: any = this.service.getFaqsMessage();
    if (faqs) {
      this.faqs = faqs;
      this.faqsSearch = this.faqs;
      this.loadingfaq = false;
    } else {
      this.getfaqs();
    }

    this.seo.updateSeoTags({
      title: 'Faqs' + ' - ' + baseUrl.feDomain,
    });
  }

  getfaqs() {
    this.loadingfaq = true;
    this.httpService.getSingleNoAuth(baseUrl.faqs).subscribe(
      (data: any) => {
        this.faqs = data?.data.filter((name: any) => {
          return name?.is_active == 1;
        });

        this.faqsSearch = this.faqs;
        this.loadingfaq = false;
        this.service.setFaqsMessage(this.faqs);
      },
      () => {
        this.loadingfaq = false;
      }
    );
  }

  ngAfterViewInit() {
    fromEvent(this.input?.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          if (this.input?.nativeElement?.value) {
            let search = this.input?.nativeElement?.value;
            let faqs = this.faqsSearch.filter((item: any) => {
              return (
                item?.question
                  ?.toLowerCase()
                  ?.includes(search?.toLowerCase()) ||
                item?.answer?.toLowerCase()?.includes(search?.toLowerCase())
              );
            });

            this.faqs = faqs;
          } else {
            this.faqs = this.faqsSearch;
          }
        })
      )
      .subscribe();
  }
}
