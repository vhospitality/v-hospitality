import { CommonModule, isPlatformBrowser } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LazyLoadImageModule } from "ng-lazyload-image";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { GalleriaModule } from "primeng/galleria";
import { InputTextModule } from "primeng/inputtext";
import { Subscription } from "rxjs";
import { baseUrl } from "../../../../environments/environment";
import { SeoService } from "../../../global-services/seo.service";
import { AboutFooterComponent } from "../../components/about-component/about-footer/about-footer.component";
import { AboutComponent } from "../../components/about-component/about/about.component";
import { BlogComponent } from "../../components/about-component/blog/blog.component";
import { ProductComponent } from "../../components/about-component/product/product.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { HeaderComponent } from "../../components/header/header.component";
import { CollectionsComponent } from "../../components/landing-page-component/collections/collections.component";
import { ListPropertyBackgroundComponent } from "../../components/landing-page-component/list-property-background/list-property-background.component";
import { SelectOptionComponent } from "../../components/select/select-option/select-option.component";
import { SelectComponent } from "../../components/select/select.component";
import { SelectService } from "../../components/select/select.service";
import { ToggleNavService } from "../../dashboard-service/toggle-nav.service";

@Component({
  selector: "app-about-us",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    CalendarModule,
    SelectComponent,
    SelectOptionComponent,
    InputTextModule,
    GalleriaModule,
    LazyLoadImageModule,
    HeaderComponent,
    FooterComponent,
    ListPropertyBackgroundComponent,
    CollectionsComponent,
    AboutFooterComponent,
    AboutComponent,
    ProductComponent,
    BlogComponent,
  ],
  templateUrl: "./about-us.component.html",
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ["./about-us.component.scss"],
})
export class AboutUsComponent implements OnInit, AfterViewInit {
  @ViewChild("contact", { static: true })
  contact!: ElementRef<HTMLDivElement>;

  @ViewChild("blog", { static: true })
  blog!: ElementRef<HTMLDivElement>;

  @Input() adressType: any;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild("addresstext") addresstext: any;
  address: any;
  minimumDate = new Date();
  title: string = "Find properties that suit your style";

  checkinDate: any;
  selectOption: any[] = [
    {
      id: 1,
      gender: "Adult",
      desc: "Ages 18 or above",
      total: 0,
    },
    {
      id: 2,
      gender: "Children",
      desc: "Ages 2 - 17",
      total: 0,
    },
    {
      id: 3,
      gender: "Infant",
      desc: "Under 2",
      total: 0,
    },
  ];

  datas: any[] = [
    {
      imgName: "/assets/images/5-bg.jpg",
    },
    {
      imgName: "/assets/images/5-bg.png",
    },
    {
      imgName: "/assets/images/3-bg.jpg",
    },
    {
      imgName: "/assets/images/4-bg.jpg",
    },
    {
      imgName: "/assets/images/third-swipper.jpg",
    },
  ];

  value?: string;
  clickEventSubscription?: Subscription;

  constructor(
    private sharedSelect: SelectService,
    private router: Router,
    private service: ToggleNavService,
    private direct: ActivatedRoute,
    private seo: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.seo.updateSeoTags({
      title: "About us" + " - " + baseUrl.feDomain,
    });
  }

  search() {
    this.service.setAccommodationMessage({
      selectOption: this.selectOption,
      country: this.address,
      date: this.checkinDate,
    });
    this.router.navigate(["/accommodations"]);
  }

  scroll(el: HTMLElement) {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        el.scrollIntoView();
      }, 100);
    }
  }

  ngAfterViewInit() {
    this.getPlaceAutocomplete();

    this.clickEventSubscription = this.sharedSelect
      .getSelectClickEvent()
      .subscribe((data: any) => {
        let findId = this.selectOption.findIndex((x) => x?.id === data?.id);

        if (data?.type === "add") {
          this.selectOption[findId].total += 1;
          if (
            this.selectOption[findId].total > 1 &&
            this.selectOption[findId].id !== 2 &&
            !this.selectOption[findId]?.gender.endsWith("s")
          ) {
            this.selectOption[findId].gender += "s";
          }
        } else if (data?.type === "minus") {
          if (this.selectOption[findId].total < 1) {
            this.selectOption[findId].total = 0;
            if (this.selectOption[findId]?.gender.endsWith("s")) {
              this.selectOption[findId].gender = this.selectOption[
                findId
              ].gender.slice(0, -1);
            }
          } else {
            this.selectOption[findId].total -= 1;
            if (
              this.selectOption[findId].total > 1 &&
              this.selectOption[findId].id !== 2 &&
              !this.selectOption[findId]?.gender.endsWith("s")
            ) {
              this.selectOption[findId].gender += "s";
            } else if (
              this.selectOption[findId]?.gender.endsWith("s") &&
              this.selectOption[findId].total < 2
            ) {
              this.selectOption[findId].gender = this.selectOption[
                findId
              ].gender.slice(0, -1);
            }
          }
        }

        this.sharedSelect.setSelectMessage(this.selectOption);
      });
  }

  private getPlaceAutocomplete() {
    if (isPlatformBrowser(this.platformId)) {
      const autocomplete = new google.maps.places.Autocomplete(
        this.addresstext?.nativeElement,
        {
          componentRestrictions: { country: "NG" },
          types: [this.adressType], // 'establishment' / 'address' / 'geocode'
        }
      );
      google.maps.event.addListener(autocomplete, "place_changed", () => {
        const place = autocomplete.getPlace();
        this.invokeEvent(place);
      });
    }
  }

  invokeEvent(place: any) {
    this.address = place;
    this.setAddress.emit(place);
  }

  ngOnDestroy(): void {
    this.clickEventSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.direct.queryParams.subscribe((params: any) => {
      if (params?.view === "contact") {
        this.scroll(this.contact?.nativeElement);
      } else if (params?.view === "blog") {
        this.scroll(this.blog?.nativeElement);
      }
    });

    (window as any).fbq("track", "Contact");
  }
}
