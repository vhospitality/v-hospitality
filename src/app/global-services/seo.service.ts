import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { baseUrl } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class SeoService {
  title: string = "Vefristay";
  description =
    "Vefristay is the trusted online platform that enables people to discover and experience the true spirit of hospitality through our curated selection of accommodations.";
  logo: string = "favicon.ico";

  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // detail: any ={
  //   title: '',
  //   description: '',
  //   image: '',
  // }

  updateSeoTags(detail: any): void {
    this.titleService.setTitle(detail?.title || this.title);

    this.metaService.updateTag({
      name: "keywords",
      content:
        "v-hospitality, vefristay, vhospitality, hospitality, v hospitality, airbnb, booking, hotel, vacation, travel, tourism, holiday, trip, accommodation, guest, host, experience, explore, discover, stay, staycation, rental, property, apartment, house, villa, room, bed, breakfast, luxury, budget, affordable, safe, secure, reliable, trusted, verified, verified host, verified guest, verified property, verified accommodation, verified experience, verified stay, verified rental, verified booking, verified hotel, verified vacation, verified trip, verified tourism, verified holiday, verified travel, verified explore, verified discover, verified staycation, verified property, verified apartment, verified house, verified villa, verified room, verified bed, verified breakfast, verified luxury, verified budget, verified affordable, verified safe, verified secure, verified reliable, verified trusted",
    });

    this.metaService.updateTag({
      name: "description",
      content: detail?.description || this.description,
    });

    this.metaService.addTag({ name: "robots", content: "index, follow" });

    // Facebook, WhatsApp, etc Card Meta Tags
    this.metaService.updateTag({
      property: "og:title",
      content: detail?.title || this.title,
    });

    this.metaService.updateTag({
      property: "og:image",
      content: detail?.image || this.logo,
    });

    this.metaService.updateTag({
      property: "og:url",
      content: this.getUrl(),
    });

    this.metaService.updateTag({
      property: "og:type",
      content: "website",
    });

    // Twitter Card Meta Tags
    this.metaService.updateTag({
      name: "twitter:card",
      content: "summary_large_image", // player, gallery, app, product
    });

    this.metaService.updateTag({
      name: "twitter:title",
      content: detail?.title || this.title,
    });

    this.metaService.updateTag({
      name: "twitter:description",
      content: detail?.description || this.description,
    });

    this.metaService.updateTag({
      name: "twitter:image",
      content: detail?.image || this.logo,
    });

    this.metaService.updateTag({
      name: "twitter:url",
      content: this.getUrl(),
    });
  }

  getUrl(): string {
    if (isPlatformBrowser(this.platformId)) {
      return window.location.href;
    }
    return baseUrl.feDomain;
  }
}
