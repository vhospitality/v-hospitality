import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { SwUpdate, VersionReadyEvent } from "@angular/service-worker";
import { BnNgIdleService } from "bn-ng-idle";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { Subscription, filter } from "rxjs";
import { DialogComponent } from "./dashboard/components/dialog/dialog.component";
import { ToggleNavService } from "./dashboard/dashboard-service/toggle-nav.service";
import { AuthService } from "./global-services/auth.service";
import { ChatService } from "./global-services/chat.service";
import { HttpService } from "./global-services/http.service";
import { SeoService } from "./global-services/seo.service";
import { baseUrl } from "../environments/environment";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, AfterViewInit {
  clickEventSubscription?: Subscription;
  token: string = "V_HOSPITALITY_DEVICE_TOKEN";
  userData: any = this.service.getProfileMessage();
  deviceToken: any;
  subscriptionPopup: boolean = false;
  canLogout: boolean = false;
  isBrowser: boolean = false;

  constructor(
    private authService: AuthService,
    private service: ToggleNavService,
    private httpService: HttpService,
    private chatService: ChatService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private updates: SwUpdate,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private bnIdle: BnNgIdleService,
    private direct: ActivatedRoute,
    private seo: SeoService,
    @Inject(DOCUMENT) private doc: Document
  ) {
    this.clickEventSubscription = this.service
      .getIsLoginClickEvent()
      .subscribe(() => {
        this.checkIfLogin();
      });

    this.checkForUpdates();
    this.seo.updateSeoTags({});
    this.setStructuredData();
  }

  setStructuredData() {
    const script = this.doc.createElement("script");
    script.type = "application/ld+json";
    script.text = `
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": ${baseUrl.feDomain2},
      "name": ${this.seo.title},
      "description": ${this.seo.description}
    }
    `;
    this.doc.head.appendChild(script);
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

  checkForUpdates(): void {
    if (this.updates.isEnabled) {
      this.updates.unrecoverable.subscribe((event) => {
        alert(
          "An error occurred that we cannot recover from:\n" +
            event.reason +
            "\n\nPlease reload the page."
        );
      });

      this.updates.versionUpdates
        .pipe(
          filter(
            (event): event is VersionReadyEvent =>
              event.type === "VERSION_READY"
          )
        )
        .subscribe(() => {
          if (confirm("New version available. Load New Version?")) {
            if (isPlatformBrowser(this.platformId)) {
              window.location.reload();
            }
          }
        });
    }
  }

  ngOnInit(): void {
    this.requestPermission();
    this.listen();

    if (isPlatformBrowser(this.platformId)) {
      this.chatService.getMessage().subscribe((data) => {
        if (data?.receiver === this.userData?.uuid) {
          this.displayMessage(data?.message, data?.sender_name);
        }
      });

      this.direct.queryParamMap.subscribe((params: any) => {
        if (
          params?.params?.auth?.toLowerCase() == "signup" ||
          params?.params?.auth?.toLowerCase() == "register"
        ) {
          this.openDialog("", "login");
          this.seo.updateSeoTags({
            title: "Sign Up" + " - " + baseUrl.feDomain,
          });
          this.router.navigate(["/home"]);
        } else if (
          params?.params?.auth?.toLowerCase() == "login" ||
          params?.params?.auth?.toLowerCase() == "signin"
        ) {
          this.openDialog("", "login2");
          this.seo.updateSeoTags({ title: "Login" + " - " + baseUrl.feDomain });
          this.router.navigate(["/home"]);
        }
      });

      this.bnIdle.startWatching(600).subscribe((isTimedOut: boolean) => {
        if (isTimedOut) {
          if (this.canLogout) {
            this.authService.logout();
            this.service.sendIsLoginClickEvent();
            this.canLogout = false;
            if (confirm("Your session has timed out. Please log in again.")) {
              this.openDialog("", "login2");
            }
          }
        }
      });
    }
  }

  checkIfLogin() {
    this.userData = this.service.getProfileMessage();
    if (this.authService.isLoggedIn()) {
      this.updateToken(this.deviceToken);
      this.canLogout = true;
    }
  }

  updateToken(token?: any) {
    if (token) {
      this.userData = this.service.getProfileMessage();
      this.registerTokenForChat(token);

      this.httpService
        .postData(baseUrl.deviceToken, {
          device_token: token || this.userData?.device_token,
          profile_picture: this.userData?.profile_picture,
          first_name: this.userData?.first_name,
          last_name: this.userData?.last_name,
        })
        .subscribe(
          () => {
            localStorage.setItem(this.token, token);
          },
          () => {}
        );
    }
  }

  requestPermission() {
    if (isPlatformBrowser(this.platformId)) {
      const messaging = getMessaging();

      getToken(messaging, { vapidKey: baseUrl.firebase.vapidKey }).then(
        (currentToken) => {
          if (currentToken) {
            this.deviceToken = currentToken;
            this.checkIfLogin();
          }
        }
      );
    }
  }

  listen() {
    if (isPlatformBrowser(this.platformId)) {
      const messaging = getMessaging();
      onMessage(messaging, (payload) => {
        this.service.sendNotificationClickEvent(payload);
      });
    }
  }

  displayMessage(message: string, title: string) {
    if (Notification.permission === "granted") {
      // Permission is granted, proceed with showing notification
      new Notification(title || "New Message!", {
        body: message,
        icon: "assets/icons/v-logo-black.svg",
        tag: "Vefristay!",
        renotify: true,
        requireInteraction: true,
        image: "assets/icons/v-logo-black.svg",
        vibrate: [200, 100, 200, 100, 200, 100, 200],
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          // Permission is granted, proceed with showing notification
          new Notification(title || "New Message!", {
            body: message,
            icon: "assets/icons/v-logo-black.svg",
            tag: "Vefristay!",
            renotify: true,
            requireInteraction: true,
            image: "assets/icons/v-logo-black.svg",
            vibrate: [200, 100, 200, 100, 200, 100, 200],
          });
        } else {
          // Permission is denied
        }
      });
    }

    this.snackBar.open("You have a new message", "x", {
      duration: 9000,
      panelClass: "success",
      horizontalPosition: "center",
      verticalPosition: "top",
    });

    this.playSound();
  }

  playSound(): void {
    let src = "/assets/mp3/message.mp3";
    let audio = new Audio(src);
    audio.play();
  }

  registerTokenForChat(token: string) {
    this.httpService
      .getForChat(baseUrl.messagingUrl + `user?u_id=${this.userData?.uuid}`)
      .subscribe(
        (data) => {
          this.updateChatToken(token, data);
        },
        (err) => {
          if (err?.status == 404 || err?.status == 400) {
            this.registerForMessaging(token);
          }
        }
      );
  }

  registerForMessaging(token: string) {
    if (token) {
      this.httpService
        .registerForChat(baseUrl.messagingUrl + "user", {
          first_name: this.userData?.first_name,
          last_name: this.userData?.last_name,
          u_id: this.userData?.uuid,
          device_token: token || this.userData?.device_token,
          profile_picture: this.userData?.profile_picture,
        })
        .subscribe((data: any) => {
          this.updateChatToken(token, data);
        });
    }
  }

  updateChatToken(token: string, data: any) {
    this.httpService.updateDeviceTokenForChat(
      baseUrl.messagingUrl + `user/${data?._id}`,
      {
        device_token: token,
        first_name: this.userData?.first_name,
        last_name: this.userData?.last_name,
        profile_picture: this.userData?.profile_picture,
      }
    );
  }

  ngAfterViewInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (isPlatformBrowser(this.platformId)) {
      let loader = document.getElementById("loader");
      if (loader) {
        loader.style.display = "none";
      }
    }
  }
}
