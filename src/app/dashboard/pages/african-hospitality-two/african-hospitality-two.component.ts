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
import { baseUrl } from "src/environments/environment";
import { ButtonModule } from "primeng/button";
import { MatButtonModule } from "@angular/material/button";
import { AvatarModule } from "primeng/avatar";
import { AvatarGroupModule } from "primeng/avatargroup";
import { LazyLoadImageModule } from "ng-lazyload-image";

@Component({
  selector: "app-african-hospitality-two",
  imports: [
    DialogModule,
    CommonModule,
    CarouselModule,
    RouterModule,
    RouterLink,
    ButtonModule,
    MatButtonModule,
    AvatarModule,
    AvatarGroupModule,
    LazyLoadImageModule,
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
        "https://res.cloudinary.com/dvujxw2d0/image/upload/v1724946384/b53684266222b5716a6b548edde3f7e1_jrfeli.jpg",
      title: "Luxury Family Home",
      location: "Lagos, Nigeria",
      rating: 4.5,
      price: 200000,
    },
    {
      image:
        "https://res.cloudinary.com/dvujxw2d0/image/upload/v1724946344/90ee85a8748c1607b05bef96115fead4_olapop.jpg",
      title: "Luxury Family Home",
      location: "Lagos, Nigeria",
      rating: 4.5,
      price: 200000,
    },
    {
      image:
        "https://res.cloudinary.com/dvujxw2d0/image/upload/v1724946329/6e0cf4e56289bdc260ed4b30022d18d9_npvgce.jpg",
      title: "Luxury Family Home",
      location: "Lagos, Nigeria",
      rating: 4.5,
      price: 200000,
    },
    {
      image:
        "https://res.cloudinary.com/dvujxw2d0/image/upload/v1724946384/b53684266222b5716a6b548edde3f7e1_jrfeli.jpg",
      title: "Luxury Family Home",
      location: "Lagos, Nigeria",
      rating: 4.5,
      price: 200000,
    },
    {
      image:
        "https://res.cloudinary.com/dvujxw2d0/image/upload/v1724946344/90ee85a8748c1607b05bef96115fead4_olapop.jpg",
      title: "Luxury Family Home",
      location: "Lagos, Nigeria",
      rating: 4.5,
      price: 200000,
    },
    {
      image:
        "https://res.cloudinary.com/dvujxw2d0/image/upload/v1724946329/6e0cf4e56289bdc260ed4b30022d18d9_npvgce.jpg",
      title: "Luxury Family Home",
      location: "Lagos, Nigeria",
      rating: 4.5,
      price: 200000,
    },
  ];

  countries = [
    {
      name: "Nigeria",
      active: true,
      url: "https://res.cloudinary.com/dvujxw2d0/image/upload/v1724946527/0f21c07576f6d45870b73c5ccced8ea5_tbxhbn.jpg",
    },
    {
      name: "Morocco",
      active: false,
      url: "https://res.cloudinary.com/dvujxw2d0/image/upload/v1724946552/b433c3bd8aa9f9df68f1efb0428cd11f_xkieww.jpg",
    },
    {
      name: "South Africa",
      active: false,
      url: "https://res.cloudinary.com/dvujxw2d0/image/upload/v1724946558/1e9f3fc3726a5331ef5c24215b2eba3a_qerznu.jpg",
    },
    {
      name: "UAE",
      active: false,
      url: "https://res.cloudinary.com/dvujxw2d0/image/upload/v1724946727/f482757901f9646a616c6b642f53c956_zxdnx0.jpg",
    },
    {
      name: "Kenya",
      active: false,
      url: "https://res.cloudinary.com/dvujxw2d0/image/upload/v1724946558/6ad434aaf030fae11838278c439f78fe_mdk2yb.jpg",
    },
    {
      name: "Egypt",
      active: false,
      url: "https://res.cloudinary.com/dvujxw2d0/image/upload/v1724946569/3b8c52c3853609f9a4b7f1f68c6dbcbd_eandyb.jpg",
    },
    {
      name: "Tunisia",
      active: false,
      url: "https://res.cloudinary.com/dvujxw2d0/image/upload/v1724946574/bd3087621a7da46e2640258ab551f4b0_vm8rip.jpg",
    },
    {
      name: "Algeria",
      active: false,
      url: "https://res.cloudinary.com/dvujxw2d0/image/upload/v1724946574/bd3087621a7da46e2640258ab551f4b0_vm8rip.jpg",
    },
    {
      name: "Namibia",
      active: false,
      url: "https://res.cloudinary.com/dvujxw2d0/image/upload/v1724946599/48b91511e0fa35dce297cb956481d588_evutgs.jpg",
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

  notifications: any[] = [];
  totalNotification: number = 0;
  isLoading: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 15;

  userData: any;
  roles: any[] = [];
  loading: boolean = false;
  wishlist: any;
  defaultImage: string = baseUrl?.defaultImage;
  defaultImage2: string = baseUrl?.defaultImage;
  switchGuest: boolean = true;
  notify: boolean = false;
  isReadNotificationLoading: boolean = false;
  unreadMessage: any = 0;
  waringMessages: any;
  profileImage: any;
  isLoaded: boolean = false;

  ngAfterViewInit(): void {
    this.checkIfLogin();
    this.userData = this.service.getProfileMessage();

    if (!this.userData) {
      this.getProfileDetails();
    } else {
      for (let r of this.userData?.roles) {
        this.roles.push(r?.name?.toLowerCase());
      }
    }
  }

  checkIfLogin() {
    this.isLogin = this.authService.isLoggedIn();
    this.userData = this.service.getProfileMessage();

    if (!this.userData) {
      this.getProfileDetails();
    } else {
      for (let r of this.userData?.roles) {
        this.roles.push(r?.name?.toLowerCase());
      }
    }
  }

  logout() {
    this.authService.logout();
    this.checkIfLogin();
  }

  getProfileDetails() {
    if (this.isLogin) {
      this.loading = true;
      this.httpService.getAuthSingle(baseUrl.profileDetails).subscribe(
        (data: any) => {
          this.userData = data?.data;
          this.profileImage = this.userData?.profile_picture;

          for (let r of this.userData?.roles) {
            this.roles.push(r?.name?.toLowerCase());
          }

          this.service.setProfileMessage(data?.data);
          this.service.sendIsLoginClickEvent();
          this.loading = false;
        },
        () => {
          this.authService.checkExpired();
          this.loading = false;
        }
      );
    }
  }

  formatName() {
    let displayname1 =
      this.userData?.first_name?.toUpperCase()?.replaceAll(" ", "") || "V";
    let displayname2 =
      this.userData?.last_name?.toUpperCase()?.replaceAll(" ", "") || "HOS";
    let displayname3 = displayname1[0] + "" + displayname2[0];
    return displayname3;
  }
}
