import { CommonModule, isPlatformBrowser } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RouterModule } from "@angular/router";
import { LazyLoadImageModule } from "ng-lazyload-image";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { AvatarModule } from "primeng/avatar";
import { AvatarGroupModule } from "primeng/avatargroup";
import { BadgeModule } from "primeng/badge";
import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { InputSwitchModule } from "primeng/inputswitch";
import { MessagesModule } from "primeng/messages";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { Subscription } from "rxjs";
import { baseUrl } from "../../../../environments/environment";
import { AuthService } from "../../../global-services/auth.service";
import { HttpService } from "../../../global-services/http.service";
import { ToggleNavService } from "../../dashboard-service/toggle-nav.service";
import { DateAgoPipe } from "../../pipes/date-ago.pipe";
import { DialogComponent } from "../dialog/dialog.component";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    MatButtonModule,
    OverlayPanelModule,
    BadgeModule,
    LazyLoadImageModule,
    InputSwitchModule,
    MatInputModule,
    FormsModule,
    InfiniteScrollModule,
    DateAgoPipe,
    AvatarModule,
    AvatarGroupModule,
    MessagesModule,
  ],
  providers: [DialogService],
  templateUrl: "./header.component.html",
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements AfterViewInit {
  ref: DynamicDialogRef | undefined;
  @ViewChild("op") op: ElementRef | any;
  isLogin: boolean = false;
  notifications: any[] = [];
  totalNotification: number = 0;
  isLoading: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 15;
  clickEventSubscription?: Subscription;
  clickEventSubscription2?: Subscription;
  clickEventSubscription3?: Subscription;
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

  constructor(
    public dialogService: DialogService,
    private dialog: MatDialog,
    private authService: AuthService,
    private service: ToggleNavService,
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    this.checkIfLogin();
    this.userData = this.service.getProfileMessage();
    this.checkIfHostOrGuest();

    this.diaplayMessage();

    if (!this.userData) {
      this.getProfileDetails();
    } else {
      for (let r of this.userData?.roles) {
        this.roles.push(r?.name?.toLowerCase());
      }
    }

    let amenities = this.service.getAmenitiesMessage();
    if (amenities) {
    } else {
      this.getAmenities();
    }

    let houseRules = this.service.getHouseRulesMessage();
    if (houseRules) {
    } else {
      this.getHouseRules();
    }

    let subscriptions = this.service.getSubscriptionsMessage();
    if (subscriptions) {
    } else {
      this.getSubscriptions();
    }

    this.clickEventSubscription = this.service
      .getIsLoginClickEvent()
      .subscribe(() => {
        this.checkIfLogin();
        this.diaplayMessage();
      });

    this.clickEventSubscription2 = this.service
      .getNotificationClickEvent()
      .subscribe((data) => {
        this.popUpNotification(data);
        this.getNewMessages();
      });

    this.clickEventSubscription3 = this.service
      .getNotificatonHeaderClickEvent()
      .subscribe(() => {
        this.getNotification();
      });

    this.httpService.getMapData();
  }

  popUpNotification(data: any) {
    if (data) {
      this.notify = true;
      this.notifications = [];
      this.currentPage = 0;
      this.getNotification();
      this.playSound();

      Notification.requestPermission(function () {
        new Notification(data?.notification?.title, {
          body: data?.notification?.body,
          icon: "assets/icons/v-logo-black.svg",
          tag: data?.notification?.title,
          renotify: true,
          requireInteraction: true,
          image: "assets/icons/v-logo-black.svg",
          vibrate: [200, 100, 200, 100, 200, 100, 200],
        });
      });
    }
  }

  diaplayMessage() {
    this.userData = this.service.getProfileMessage();

    if (
      !this.userData?.reason_for_advance_verification_rejection &&
      this.userData?.is_advanced_verified === 0 &&
      this.userData?.identity_documents?.length < 1
    ) {
      this.waringMessages = [
        {
          severity: "warn",
          summary: "User verification:",
          detail:
            "Complete your verification process by uploading a means of identification and be able to list and book a property on vefristay.",
        },
      ];
    } else if (
      !this.userData?.reason_for_advance_verification_rejection &&
      this.userData?.is_advanced_verified === 0 &&
      this.userData?.identity_documents?.length >= 1
    ) {
      this.waringMessages = [
        {
          severity: "info",
          summary: "User verification:",
          detail:
            "We're currently in the process of reviewing your application. We'll notify you as soon as the review is complete.",
        },
      ];
    } else if (
      this.userData?.reason_for_advance_verification_rejection &&
      this.userData?.is_advanced_verified === 0
    ) {
      this.waringMessages = [
        {
          severity: "error",
          summary: "User verification:",
          detail:
            "We regret to inform you that your application has been declined. Please update your documents to provide clearer information, which will help facilitate the process.",
        },
      ];
    }
  }

  playSound() {
    let src = "/assets/mp3/message.mp3";
    let audio = new Audio(src);
    audio.play();
  }

  removePopUpNotification() {
    this.notify = false;
    setTimeout(() => {
      this.readNotification();
    }, 10000);
  }

  openSideBar() {
    this.service.sendHeaderClickEvent();
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
      this.checkIfHostOrGuest();
    }

    // if (!this.userData?.profile_picture) {
    //   this.getProfileDetails();
    // }

    if (this.isLogin) {
      // wishlist
      let wishlist = this.service.getWishlistMessage();
      if (wishlist) {
        this.wishlist = wishlist;
      } else {
        this.getWishlist();
      }
      this.getNotification();
      this.getNewMessages();
    }
  }

  logout() {
    this.authService.logout();
    this.checkIfLogin();
  }

  checkIfHostOrGuest() {
    if (isPlatformBrowser(this.platformId)) {
      // if (this.roles?.includes('host')) {
      if (localStorage.getItem("CURRENT_USER_TYPE") === null) {
        this.switchGuest = true;
      } else {
        let switchGuest = localStorage.getItem("CURRENT_USER_TYPE") as any;
        if (switchGuest === "true") {
          this.switchGuest = true;
        } else {
          this.switchGuest = false;
        }
      }
      // }
    }
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

          this.checkIfHostOrGuest();
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

  getAmenities() {
    this.httpService
      .getSingleNoAuth(
        baseUrl.amenityCategories + "?include=amenities&per_page=100"
      )
      .subscribe(
        (data: any) => {
          this.service.setAmenitiestMessage(data?.data);
        },
        () => {}
      );
  }

  getHouseRules() {
    this.httpService.getSingleNoAuth(baseUrl.houseRules).subscribe(
      (data: any) => {
        this.service.setHouseRulesMessage(data?.data);
      },
      () => {}
    );
  }

  getSubscriptions() {
    this.httpService.getSingleNoAuth(baseUrl.subscriptions).subscribe(
      (data: any) => {
        this.service.setSubscriptionsMessage(data);
      },
      () => {}
    );
  }

  getWishlist() {
    this.httpService
      .getAuthSingle(
        baseUrl.wishlist + "/?per_page=1&include=listing&fields[listing]=uuid"
      )
      .subscribe(
        (data: any) => {
          this.wishlist = data?.data;
          this.service.setWishlistMessage(data?.data);
        },
        () => {}
      );
  }

  getNotification() {
    if (this.notifications?.length > 0) {
      return;
    } else {
      this.isLoading = true;
      this.currentPage = 0;
      this.notifications = [];

      this.httpService
        .getAuthSingle(
          baseUrl.notifications +
            `/?filter[notification]=all&per_page=${this.itemsPerPage}&page=${this.currentPage}`
        )
        .subscribe(
          (data: any) => {
            this.notifications = data?.data?.data;
            this.totalNotification = data?.data?.total || 0;
            this.service.setNotificationMessage(data?.data?.data);
            this.isLoading = false;
          },
          () => {
            this.isLoading = false;
          }
        );
    }
  }

  // read notification
  readNotification(id?: string, index?: any) {
    if (id) {
      this.httpService
        .updateData(baseUrl.notifications + `/${id}`, "")
        .subscribe((data: any) => {
          this.notifications[index]["read_at"] = new Date();
          // this.notifications.splice(index, 1);
          if (this.totalNotification > 0) {
            this.totalNotification = this.totalNotification - 1;
          }
        });
    } else {
      this.isReadNotificationLoading = true;
      this.httpService.updateData(baseUrl.notifications + "/all", "").subscribe(
        () => {
          this.isReadNotificationLoading = false;
          // this.notifications = [];
          this.totalNotification = 0;
          this.notifications.forEach((n: any, index: number) => {
            this.notifications[index]["read_at"] = new Date();
          });
        },
        (err) => {
          this.isReadNotificationLoading = false;
        }
      );
    }
  }

  // this method will be called on scrolling the page
  appendNotification = () => {
    this.isLoading = true;

    this.httpService
      .getAuthSingle(
        baseUrl.notifications +
          `/?filter[notification]=all&per_page=${this.itemsPerPage}&page=${this.currentPage}`
      )
      .subscribe(
        (data: any) => {
          this.notifications = [...this.notifications, ...data?.data?.data];
          // remove duplicate
          const uniqueYear = [
            ...new Map(this.notifications.map((v: any) => [v?.id, v])).values(),
          ];
          this.notifications = uniqueYear.map((item) => item);
          this.totalNotification = data?.data?.total || 0;
          this.service.setNotificationMessage(this.notifications);
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        }
      );
  };

  onScroll = () => {
    this.currentPage++;
    this.appendNotification();
  };

  hasNotification() {
    const check = this.notifications.find((n: any) => n.read_at === null);
    if (check) {
      return true;
    } else {
      return false;
    }
  }

  switch(type: boolean) {
    this.switchGuest = type;
    localStorage.setItem("CURRENT_USER_TYPE", type.toString());
    this.service.sendIsLoginClickEvent();

    this.snackBar.open(
      `You have successfully switched to a ${
        type ? "Guest" : "Host"
      } user status`,
      "x",
      {
        duration: 3000,
        panelClass: "success",
        horizontalPosition: "center",
        verticalPosition: "top",
      }
    );
  }

  formatName() {
    let displayname1 =
      this.userData?.first_name?.toUpperCase()?.replaceAll(" ", "") || "V";
    let displayname2 =
      this.userData?.last_name?.toUpperCase()?.replaceAll(" ", "") || "HOS";
    let displayname3 = displayname1[0] + "" + displayname2[0];
    return displayname3;
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

  // verifyAccount() {
  //   this.dialog.open(DialogComponent, {
  //     data: {
  //       type: 'dialog',
  //       data: {
  //         requestType: 'identity',
  //         requestMessage: 'Please verify your identity',
  //         data: '',
  //       },
  //     },
  //   });
  // }

  verifyAccount() {
    this.dialog.open(DialogComponent, {
      data: {
        type: "dialog",
        data: {
          requestType: "upload",
          requestMessage: "Please verify your identity",
          data: "",
        },
      },
    });
  }

  getNewMessages() {
    // this.httpService
    //   .getForChat(
    //     baseUrl.messagingUrl + 'messages/unreads/' + this.userData?.uuid
    //   )
    //   .subscribe((data: any) => {
    //     this.unreadMessage = data?.unread;
    //   });
  }

  isAccountVerifiable(): boolean {
    return (
      (this.userData?.reason_for_advance_verification_rejection ||
        this.userData?.identity_documents?.length < 1) &&
      this.userData?.is_advanced_verified === 0
    );
  }

  handleClick(): void {
    if (this.isAccountVerifiable()) {
      this.verifyAccount();
    }
  }
}
