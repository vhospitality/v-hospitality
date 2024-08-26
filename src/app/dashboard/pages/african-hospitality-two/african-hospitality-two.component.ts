import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from "@angular/core";
import { DialogModule } from "primeng/dialog";
import { CarouselModule, CarouselResponsiveOptions } from "primeng/carousel";
import { DialogService } from "primeng/dynamicdialog";
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "src/app/global-services/auth.service";
import { ToggleNavService } from "../../dashboard-service/toggle-nav.service";
import { HttpService } from "src/app/global-services/http.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DialogComponent } from "../../components/dialog/dialog.component";
import { Router, RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: "app-african-hospitality-two",
  imports: [
    DialogModule,
    CommonModule,
    CarouselModule,
    RouterModule,
    RouterLink,
  ],
  providers: [DialogService],
  standalone: true,
  templateUrl: "./african-hospitality-two.component.html",
  styleUrls: ["./african-hospitality-two.component.scss"],
})
export class AfricanHospitalityTwoComponent {
  @Input() addressType: any;

  @ViewChild("propertySlider") propertySlider!: ElementRef;

  isLogin: boolean = false;
  currentIndex = 0;

  isSearchModalVisible = false;

  constructor(
    public dialogService: DialogService,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private service: ToggleNavService,
    private httpService: HttpService,
    private snackBar: MatSnackBar
  ) {}

  properties = [
    {
      image: "assets/property1.jpg",
      title: "Luxury Family Home",
      location: "Lagos, Nigeria",
      rating: 4.5,
      price: 200000,
    },
    {
      image: "assets/property2.jpg",
      title: "Luxury Family Home 2",
      location: "Abuja, Nigeria",
      rating: 4.7,
      price: 250000,
    },
    {
      image: "assets/property3.jpg",
      title: "Luxury Family Home 3",
      location: "Port Harcourt, Nigeria",
      rating: 4.3,
      price: 180000,
    },
  ];

  showSearchModal() {
    this.isSearchModalVisible = true;
  }

  hideSearchModal() {
    this.isSearchModalVisible = false;
  }

  openDialog(data: any, type: string) {
    this.dialog.closeAll();
    this.dialog.open(DialogComponent, {
      data: {
        type: type,
        data: data,
      },
    });
  }

  responsiveOptions: CarouselResponsiveOptions[] = [
    {
      breakpoint: "3000px",
      numVisible: 4,
      numScroll: 1,
    },
    {
      breakpoint: "1350px",
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: "768px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "480px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  testimonies = [
    {
      remark: "Great Job",
      testimony:
        " ⁠I recently booked a stay through V Hospitality, and I have to say, it was fantastic! The site was super easy to use, and the place I found was exactly as described. The host was really welcoming, and the property was spotless. Honestly, this is my new go-to for travel in Nigeria.",
      rating: 5,
      reviewer: {
        image: "assets/images/logo.png",
        name: "Emily",
        position: "",
      },
    },
    {
      remark: "Great Job",
      testimony:
        "V Hospitality really came through for me. I booked a beautiful apartment in Abuja that felt just like home. The host was super accommodating, and the neighborhood was exactly what I expected from the description. I’m already looking forward to my next trip with V Hospitality.",
      rating: 5,
      reviewer: {
        image: "assets/images/logo.png",
        name: "Amina Yusuf",
        position: "",
      },
    },
    {
      remark: "Great Job",
      testimony:
        "I was surprised by how many affordable yet luxurious options there were on V Hospitality. Booking was a breeze, and there were no hidden fees, which I really appreciated. My stay exceeded my expectations, and I’ll definitely be using this platform again.",
      rating: 5,
      reviewer: {
        image: "assets/images/logo.png",
        name: "Folake Adeyemi",
        position: "",
      },
    },
    {
      remark: "Great Job",
      testimony:
        "I was surprised by how many affordable yet luxurious options there were on V Hospitality. Booking was a breeze, and there were no hidden fees, which I really appreciated. My stay exceeded my expectations, and I’ll definitely be using this platform again.",
      rating: 5,
      reviewer: {
        image: "assets/images/logo.png",
        name: "Chidi Okafor",
        position: "",
      },
    },
  ];

  items = [
    {
      image:
        "https://s3-alpha-sig.figma.com/img/0327/90af/90ee85a8748c1607b05bef96115fead4?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dt7quZjRhrNMnG2Z8hjC8l5MCFAyw54hGBY1mTbZ665lkkIsVdSbrqn3uYd4CgePTxan1Vqh3OqbD-KurxBa7mUD~rYOi9JvbEhncauovYuUQI8u-~-n2OtyAHHkqJKbSB-Nh~vRd5w8BEOah69svc1M3VpQxNBBED0oCW4mK~4F3HIkMLS0j1o8geChQ7-TJdJhSDRb27koRCfDcTbvYSSc81LdWvOEVsljJxFQGlWYRNy6WJT77KLw9z08nBEwkADdTym7toeeeXuHMgfxfPlu9~FiBVyAH1skeDzsgW374gi1HTOUjUqZe5dSKs0F9WOJvV2DzXXozPPjLFh-JA__",
      title: "Luxury Family Home",
      description: "Description 1",
    },
    {
      image:
        "https://s3-alpha-sig.figma.com/img/0327/90af/90ee85a8748c1607b05bef96115fead4?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dt7quZjRhrNMnG2Z8hjC8l5MCFAyw54hGBY1mTbZ665lkkIsVdSbrqn3uYd4CgePTxan1Vqh3OqbD-KurxBa7mUD~rYOi9JvbEhncauovYuUQI8u-~-n2OtyAHHkqJKbSB-Nh~vRd5w8BEOah69svc1M3VpQxNBBED0oCW4mK~4F3HIkMLS0j1o8geChQ7-TJdJhSDRb27koRCfDcTbvYSSc81LdWvOEVsljJxFQGlWYRNy6WJT77KLw9z08nBEwkADdTym7toeeeXuHMgfxfPlu9~FiBVyAH1skeDzsgW374gi1HTOUjUqZe5dSKs0F9WOJvV2DzXXozPPjLFh-JA__",
      title: "Luxury Family Home",
      description: "Description 2",
    },
    {
      image:
        "https://s3-alpha-sig.figma.com/img/0327/90af/90ee85a8748c1607b05bef96115fead4?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dt7quZjRhrNMnG2Z8hjC8l5MCFAyw54hGBY1mTbZ665lkkIsVdSbrqn3uYd4CgePTxan1Vqh3OqbD-KurxBa7mUD~rYOi9JvbEhncauovYuUQI8u-~-n2OtyAHHkqJKbSB-Nh~vRd5w8BEOah69svc1M3VpQxNBBED0oCW4mK~4F3HIkMLS0j1o8geChQ7-TJdJhSDRb27koRCfDcTbvYSSc81LdWvOEVsljJxFQGlWYRNy6WJT77KLw9z08nBEwkADdTym7toeeeXuHMgfxfPlu9~FiBVyAH1skeDzsgW374gi1HTOUjUqZe5dSKs0F9WOJvV2DzXXozPPjLFh-JA__",
      title: "Luxury Family Home",
      description: "Description 3",
    },
    {
      image:
        "https://s3-alpha-sig.figma.com/img/0327/90af/90ee85a8748c1607b05bef96115fead4?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dt7quZjRhrNMnG2Z8hjC8l5MCFAyw54hGBY1mTbZ665lkkIsVdSbrqn3uYd4CgePTxan1Vqh3OqbD-KurxBa7mUD~rYOi9JvbEhncauovYuUQI8u-~-n2OtyAHHkqJKbSB-Nh~vRd5w8BEOah69svc1M3VpQxNBBED0oCW4mK~4F3HIkMLS0j1o8geChQ7-TJdJhSDRb27koRCfDcTbvYSSc81LdWvOEVsljJxFQGlWYRNy6WJT77KLw9z08nBEwkADdTym7toeeeXuHMgfxfPlu9~FiBVyAH1skeDzsgW374gi1HTOUjUqZe5dSKs0F9WOJvV2DzXXozPPjLFh-JA__",
      title: "Luxury Family Home",
      description: "Description 4",
    },
    {
      image:
        "https://s3-alpha-sig.figma.com/img/0327/90af/90ee85a8748c1607b05bef96115fead4?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dt7quZjRhrNMnG2Z8hjC8l5MCFAyw54hGBY1mTbZ665lkkIsVdSbrqn3uYd4CgePTxan1Vqh3OqbD-KurxBa7mUD~rYOi9JvbEhncauovYuUQI8u-~-n2OtyAHHkqJKbSB-Nh~vRd5w8BEOah69svc1M3VpQxNBBED0oCW4mK~4F3HIkMLS0j1o8geChQ7-TJdJhSDRb27koRCfDcTbvYSSc81LdWvOEVsljJxFQGlWYRNy6WJT77KLw9z08nBEwkADdTym7toeeeXuHMgfxfPlu9~FiBVyAH1skeDzsgW374gi1HTOUjUqZe5dSKs0F9WOJvV2DzXXozPPjLFh-JA__",
      title: "Luxury Family Home",
      description: "Description 5",
    },
    {
      image:
        "https://s3-alpha-sig.figma.com/img/0327/90af/90ee85a8748c1607b05bef96115fead4?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dt7quZjRhrNMnG2Z8hjC8l5MCFAyw54hGBY1mTbZ665lkkIsVdSbrqn3uYd4CgePTxan1Vqh3OqbD-KurxBa7mUD~rYOi9JvbEhncauovYuUQI8u-~-n2OtyAHHkqJKbSB-Nh~vRd5w8BEOah69svc1M3VpQxNBBED0oCW4mK~4F3HIkMLS0j1o8geChQ7-TJdJhSDRb27koRCfDcTbvYSSc81LdWvOEVsljJxFQGlWYRNy6WJT77KLw9z08nBEwkADdTym7toeeeXuHMgfxfPlu9~FiBVyAH1skeDzsgW374gi1HTOUjUqZe5dSKs0F9WOJvV2DzXXozPPjLFh-JA__",
      title: "Luxury Family Home",
      description: "Description 4",
    },
    {
      image:
        "https://s3-alpha-sig.figma.com/img/0327/90af/90ee85a8748c1607b05bef96115fead4?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dt7quZjRhrNMnG2Z8hjC8l5MCFAyw54hGBY1mTbZ665lkkIsVdSbrqn3uYd4CgePTxan1Vqh3OqbD-KurxBa7mUD~rYOi9JvbEhncauovYuUQI8u-~-n2OtyAHHkqJKbSB-Nh~vRd5w8BEOah69svc1M3VpQxNBBED0oCW4mK~4F3HIkMLS0j1o8geChQ7-TJdJhSDRb27koRCfDcTbvYSSc81LdWvOEVsljJxFQGlWYRNy6WJT77KLw9z08nBEwkADdTym7toeeeXuHMgfxfPlu9~FiBVyAH1skeDzsgW374gi1HTOUjUqZe5dSKs0F9WOJvV2DzXXozPPjLFh-JA__",
      title: "Luxury Family Home",
      description: "Description 5",
    },
  ];

  propertiesTwo = [
    {
      image:
        "https://s3-alpha-sig.figma.com/img/0327/90af/90ee85a8748c1607b05bef96115fead4?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dt7quZjRhrNMnG2Z8hjC8l5MCFAyw54hGBY1mTbZ665lkkIsVdSbrqn3uYd4CgePTxan1Vqh3OqbD-KurxBa7mUD~rYOi9JvbEhncauovYuUQI8u-~-n2OtyAHHkqJKbSB-Nh~vRd5w8BEOah69svc1M3VpQxNBBED0oCW4mK~4F3HIkMLS0j1o8geChQ7-TJdJhSDRb27koRCfDcTbvYSSc81LdWvOEVsljJxFQGlWYRNy6WJT77KLw9z08nBEwkADdTym7toeeeXuHMgfxfPlu9~FiBVyAH1skeDzsgW374gi1HTOUjUqZe5dSKs0F9WOJvV2DzXXozPPjLFh-JA__",
      title: "Luxury Family Home",
      location: "Lagos, Nigeria",
      rating: 4.5,
      price: 200000,
    },
    {
      image:
        "https://s3-alpha-sig.figma.com/img/0327/90af/90ee85a8748c1607b05bef96115fead4?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dt7quZjRhrNMnG2Z8hjC8l5MCFAyw54hGBY1mTbZ665lkkIsVdSbrqn3uYd4CgePTxan1Vqh3OqbD-KurxBa7mUD~rYOi9JvbEhncauovYuUQI8u-~-n2OtyAHHkqJKbSB-Nh~vRd5w8BEOah69svc1M3VpQxNBBED0oCW4mK~4F3HIkMLS0j1o8geChQ7-TJdJhSDRb27koRCfDcTbvYSSc81LdWvOEVsljJxFQGlWYRNy6WJT77KLw9z08nBEwkADdTym7toeeeXuHMgfxfPlu9~FiBVyAH1skeDzsgW374gi1HTOUjUqZe5dSKs0F9WOJvV2DzXXozPPjLFh-JA__",
      title: "Luxury Family Home",
      location: "Lagos, Nigeria",
      rating: 4.5,
      price: 200000,
    },
    {
      image:
        "https://s3-alpha-sig.figma.com/img/0327/90af/90ee85a8748c1607b05bef96115fead4?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dt7quZjRhrNMnG2Z8hjC8l5MCFAyw54hGBY1mTbZ665lkkIsVdSbrqn3uYd4CgePTxan1Vqh3OqbD-KurxBa7mUD~rYOi9JvbEhncauovYuUQI8u-~-n2OtyAHHkqJKbSB-Nh~vRd5w8BEOah69svc1M3VpQxNBBED0oCW4mK~4F3HIkMLS0j1o8geChQ7-TJdJhSDRb27koRCfDcTbvYSSc81LdWvOEVsljJxFQGlWYRNy6WJT77KLw9z08nBEwkADdTym7toeeeXuHMgfxfPlu9~FiBVyAH1skeDzsgW374gi1HTOUjUqZe5dSKs0F9WOJvV2DzXXozPPjLFh-JA__",
      title: "Luxury Family Home",
      location: "Lagos, Nigeria",
      rating: 4.5,
      price: 200000,
    },
    {
      image:
        "https://s3-alpha-sig.figma.com/img/0327/90af/90ee85a8748c1607b05bef96115fead4?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dt7quZjRhrNMnG2Z8hjC8l5MCFAyw54hGBY1mTbZ665lkkIsVdSbrqn3uYd4CgePTxan1Vqh3OqbD-KurxBa7mUD~rYOi9JvbEhncauovYuUQI8u-~-n2OtyAHHkqJKbSB-Nh~vRd5w8BEOah69svc1M3VpQxNBBED0oCW4mK~4F3HIkMLS0j1o8geChQ7-TJdJhSDRb27koRCfDcTbvYSSc81LdWvOEVsljJxFQGlWYRNy6WJT77KLw9z08nBEwkADdTym7toeeeXuHMgfxfPlu9~FiBVyAH1skeDzsgW374gi1HTOUjUqZe5dSKs0F9WOJvV2DzXXozPPjLFh-JA__",
      title: "Luxury Family Home",
      location: "Lagos, Nigeria",
      rating: 4.5,
      price: 200000,
    },
    {
      image:
        "https://s3-alpha-sig.figma.com/img/0327/90af/90ee85a8748c1607b05bef96115fead4?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dt7quZjRhrNMnG2Z8hjC8l5MCFAyw54hGBY1mTbZ665lkkIsVdSbrqn3uYd4CgePTxan1Vqh3OqbD-KurxBa7mUD~rYOi9JvbEhncauovYuUQI8u-~-n2OtyAHHkqJKbSB-Nh~vRd5w8BEOah69svc1M3VpQxNBBED0oCW4mK~4F3HIkMLS0j1o8geChQ7-TJdJhSDRb27koRCfDcTbvYSSc81LdWvOEVsljJxFQGlWYRNy6WJT77KLw9z08nBEwkADdTym7toeeeXuHMgfxfPlu9~FiBVyAH1skeDzsgW374gi1HTOUjUqZe5dSKs0F9WOJvV2DzXXozPPjLFh-JA__",
      title: "Luxury Family Home",
      location: "Lagos, Nigeria",
      rating: 4.5,
      price: 200000,
    },
    {
      image:
        "https://s3-alpha-sig.figma.com/img/0327/90af/90ee85a8748c1607b05bef96115fead4?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dt7quZjRhrNMnG2Z8hjC8l5MCFAyw54hGBY1mTbZ665lkkIsVdSbrqn3uYd4CgePTxan1Vqh3OqbD-KurxBa7mUD~rYOi9JvbEhncauovYuUQI8u-~-n2OtyAHHkqJKbSB-Nh~vRd5w8BEOah69svc1M3VpQxNBBED0oCW4mK~4F3HIkMLS0j1o8geChQ7-TJdJhSDRb27koRCfDcTbvYSSc81LdWvOEVsljJxFQGlWYRNy6WJT77KLw9z08nBEwkADdTym7toeeeXuHMgfxfPlu9~FiBVyAH1skeDzsgW374gi1HTOUjUqZe5dSKs0F9WOJvV2DzXXozPPjLFh-JA__",
      title: "Luxury Family Home",
      location: "Lagos, Nigeria",
      rating: 4.5,
      price: 200000,
    },
    // Add more properties
  ];

  countries = [
    {
      name: "Nigeria",
      active: true,
      url: "https://s3-alpha-sig.figma.com/img/95d5/53f4/0f21c07576f6d45870b73c5ccced8ea5?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NLTu5bHBl5vd0kQWPbo5Ers7FrDCdLvnzvCDhHcUyBr9o3nKEi3TjWVycGL5ohhlyNV4kULfmrG292TBu75wdiAsmprXxHWJ9zKHHr5HULdXr~6Uz8Qp1vtWSQA2Ek~9M1gUM8x-qfs6Z4iYMP7U8STUPVs2o4IYTi0ogHGZoO5BAdUlBHPgAg767wy7~ILlBoc2qHID~YnOusEs4GDxjr4Y4FqjGmwS8rOZDqwHZqAmoEYDX0YgXIORlGw-2~aWSMqFDELUQ6F-LgQ558DNyMcA3DZBUyED6ps~bkMmKluW6sQ127UqGOcQMhhFPRN9-ZYyHVdwxwffUtkNOPmliw__",
    },
    {
      name: "Morocco",
      active: false,
      url: "https://s3-alpha-sig.figma.com/img/8ad0/f8b5/b433c3bd8aa9f9df68f1efb0428cd11f?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=P~MzgnS75Qof8HksVX43JWxLDJZl~Y6pNAt87~t66M2JT5uBmww28MnLwbbtc7Vt24fA0GKDwZOqXBhPFcxR~qWzqUMaWBqgIt60nFMCBVJA1Nfrh4BULcvNMz7cs6Y005uny01Er~cI8XjwOg8cPQYZHbZu44iTSf3-zw~WRY5AgTIvwmV8p2om64X81OWDw72zKbn2Z~lQ-I7UZROSNnXpRvTE1LQftl4WWOiZ5uG-MUfMgeUZTpwEyC24RUdoh0QvxmXjWedn65K9LssKTTtnkt5lL5--aE5E8VUV~Nha0NC6XwUfRGFGpLeqh6LkdRzz7AotxMNrXq9Uf5K2iA__",
    },
    {
      name: "South Africa",
      active: false,
      url: "https://s3-alpha-sig.figma.com/img/afa7/63fa/1e9f3fc3726a5331ef5c24215b2eba3a?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=nI96oR2HwSV55TGq2bIIWVqPFAoJPL3YWwyzppg7GioL5hP~l306ce2Yxvx6~doQrN9padidM33-TAQxmarmX~jPtSCSVttOu8CnDiEZYW4yn5cC2-2i4UxqGSYWenZWswvNl8zweEQB2cPTM7wDp693R9GK8aRwSwlu6LYyj0IVtRCDdn1YhsahT3mlJpqAvML3IxX2CjErGD5TqRqiWCKTZI0Q8tIpGVFhIN36fsS-x4gzHRBNiVxM4oV6ZTOkfO7SlNsfe4CG0rX7btymkVjS99i5CGSMQXjfuq7LhF8mpeMXZsajColSATCAakHvPBN7XxreHLJ6WQZVAoXc0g__",
    },
    {
      name: "UAE",
      active: false,
      url: "https://s3-alpha-sig.figma.com/img/60e0/2305/f482757901f9646a616c6b642f53c956?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=iwyliInu~XOlalMHmui442mZ1jkRwY0nrpsH96igyZPOyrokAyDH0atPGIFCt2FHAYc2h86qI9oogFr3Qhgf~~ar0I-y6oquEYtqqU9xFJFCjYgyWzq8SrHqbe7QQNbl9WNvWqnHZ36dLTati-Ano19oDXNrqxCHLUYaP4iiydb~fVKPZFWUZBLDwDYqZ81Bn~pMREAw0nI2a4ysG-tg0~dhubM0nIBnbrfj-55PV-OCBvqkIt5fnXNM5nbLv6eI0UPd2ARDItL0enJDYaFwF2tfFDolL5fLXnDrXDMaHef-H4~LodZvTw0dzzfdORtYCDJmA39CtQlEzVPTAP0eaQ__",
    },
    {
      name: "Kenya",
      active: false,
      url: "https://s3-alpha-sig.figma.com/img/094e/2636/6ad434aaf030fae11838278c439f78fe?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hMvMEh6j6TlMippOZYV~MZNsHxPD0P4CXczWiN22C-O5awaJyNju9XYF1e0Mp28t3~8lc8Nj~74HmRIs-GXXFH6Urc9vZSC-atyoeEiRqXBGn0CHHx8tMZHSum0I~OANIUGnMt-xjL6TYdUsjDbFO4p0JQ-okwlBh78sQD2RbmDsytEWPF1oSL1cw4ulieMS4mytE5MPB1WhDK-SpXR95x1fnAjhbkjPbmVe3hHdIg5WSF7dTRqySzb1S1M1ScG582~LBDISbLOEm0Qp58yqfJr~Xyl320yMjQ6rc2AZX1pubWnxI2uQPKN06wwrFmiMuy62TzXLqAqcufWZPn2PaQ__",
    },
    {
      name: "Egypt",
      active: false,
      url: "https://s3-alpha-sig.figma.com/img/cf20/6bed/3b8c52c3853609f9a4b7f1f68c6dbcbd?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=omZ-dRDUjyGCYxKRrPzAEIK~H6Du4yobXxXbjyYhDV2Pk1ShTdnk7rnomq8L9Bp0cgwHhcwxTpg6hK13wQbWXMdO0Nm863sdy~GGfg7LT9DIVvOSOXrkV65I~rb6XrQjLodkEBYKU4JcqbwMbeRsgyZNjoFrE~bo53Fr2Jh-5DS7Zi25kJM5qH-KAQMFVpAHTuHPUWiAwsXPyEK1y9p7TjxIsjUgOtCUw-fi8xJuD6FLpNsg0Y0Z8yzP7bYFvPFL55F6A2BnoLbPWk7LFd6xpLr5GlAJe634PAA-mKf1YCSK417tK~gl6V4EgrtntITTzuOtq4HsFSkMEpcghOGSsw__",
    },
    {
      name: "Tunisia",
      active: false,
      url: "https://s3-alpha-sig.figma.com/img/0ec5/7bc1/bd3087621a7da46e2640258ab551f4b0?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=SwkEhkONHg~xn3nHl34WpHy3uRgAwtQj510jKAzkeMtEr4oSep4O7yifB2dnyhp9d~m5fU-2wqKFFxv8iqLR8XLJowI0r43OqlSWyZjvAROSQCgLvhn40ZtuLB8mZUINYgqNES7I0Ut~I7tDhLCJMxP-heHmw1WugcUpKVeW9ZPCt~e9S2YqX1eGtlUp0I8ggE~31hq7KNtdXNSErTkHgo7m81MgzMoQjYySTAHmeokKO6Kysbp3qtigf5jIblqRT33NVbzvvV71qruOA-f1EJHxHKy7JunOHYZUiHY0YZ2KXYscmgAJrV82aJvMQd5rvMEW7ZsdX2fwUjtHRxXqZw__",
    },
    {
      name: "Algeria",
      active: false,
      url: "https://s3-alpha-sig.figma.com/img/9dff/a707/f9bbb1455af3fe6ad841f21c82526483?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=M5FrIPbCv3nyDIwpzMEwAgD~IG-ivyk~RbKdYI8fk10K8z51HMSjo5e9GLc~VgwE5prgA1eVc~3nVYxUj-auW~e7jvUQ82KOMejKn6jWxwkwdO6el6c~9G62lPgdk75WiC4Mi2AI6rauAi2G-xda63RcHT1YsTvBc4teOXOc8A7c4WWVeepk3AoSKukHohkib7lxj2jXQsloSiZD-i7Ikfj7Gmvsepq~8eVOtZm3tvGgFMZYMZqRIy7PRX19B-TYdilEl7wSwQhExM1~EC214Sw3N2ETcLAQWZLBcLTJH5B0nthjsa2qmlQr4Xy3bCwNXt6m3BC2IuxLF~vd4A6tsg__",
    },
    {
      name: "Namibia",
      active: false,
      url: "https://s3-alpha-sig.figma.com/img/0532/58b0/48b91511e0fa35dce297cb956481d588?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LROMDPGLGTprcHBGxd2JCF-GFo~O5GWxcq8~a2Lhcm17bTWQFwszeZkk7tzpBH6HM1mkT36iw4~-DXuBdeEttDZC9vX1sCeb7lOQJMErIaVemd7m6i6cRI0g6i~pF~WkLLs-qlre3JGtj~-9Bxqg3XYuWrrKmBmQf1~lmldVxsng2nVacil0DHK8F1rwBYB0swxs6-jDXrEXTzXVk4Dg3d9Ae6pRSvQCMPgn4Zo~uRCDJRUKiXtL4yScvBY2GiYaSehtlW64oYLm4WK-gHlHOwCO~~VgoPmSEucO2kERDUFL2FtB3uvo7dLtcX6Bri23K8eIQmajddJ2ozi9pp1~UA__",
    },
  ];

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.properties.length;
    this.updateSliderPosition();
  }

  prevSlide() {
    this.currentIndex =
      (this.currentIndex - 1 + this.properties.length) % this.properties.length;
    this.updateSliderPosition();
  }

  private updateSliderPosition() {
    const slider = this.propertySlider.nativeElement;
    slider.style.transform = `translateX(-${this.currentIndex * 33.33}%)`;
  }

  redirectContact() {
    this.router.navigate(["/about"]);
    setTimeout(() => {
      this.router.navigate(["/about"], { queryParams: { view: "contact" } });
    }, 50);
  }
}
