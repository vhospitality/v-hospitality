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
import { Router, RouterModule } from "@angular/router";

@Component({
  selector: "app-african-hospitality-two",
  imports: [DialogModule, CommonModule, CarouselModule, RouterModule],
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
        "“At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et”",
      rating: 5,
      reviewer: {
        image: "assets/images/m13.jpg.png",
        name: "John Doe",
        position: "Marketing",
      },
    },
    {
      remark: "Great Job",
      testimony:
        "“At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et”",
      rating: 5,
      reviewer: {
        image: "assets/images/m13.jpg.png",
        name: "John Doe",
        position: "Marketing",
      },
    },
    {
      remark: "Great Job",
      testimony:
        "“At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et”",
      rating: 5,
      reviewer: {
        image: "assets/images/m13.jpg.png",
        name: "John Doe",
        position: "Marketing",
      },
    },
    {
      remark: "Great Job",
      testimony:
        "“At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et”",
      rating: 5,
      reviewer: {
        image: "assets/images/m13.jpg.png",
        name: "John Doe",
        position: "Marketing",
      },
    },
    {
      remark: "Great Job",
      testimony:
        "“At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et”",
      rating: 5,
      reviewer: {
        image: "assets/images/m13.jpg.png",
        name: "John Doe",
        position: "Marketing",
      },
    },
    {
      remark: "Great Job",
      testimony:
        "“At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et”",
      rating: 5,
      reviewer: {
        image: "assets/images/m13.jpg.png",
        name: "John Doe",
        position: "Marketing",
      },
    },
    {
      remark: "Great Job",
      testimony:
        "“At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et”",
      rating: 5,
      reviewer: {
        image: "assets/images/m13.jpg.png",
        name: "John Doe",
        position: "Marketing",
      },
    },
    {
      remark: "Great Job",
      testimony:
        "“At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et”",
      rating: 5,
      reviewer: {
        image: "assets/images/m13.jpg.png",
        name: "John Doe",
        position: "Marketing",
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
