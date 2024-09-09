import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import snsWebSdk from "@sumsub/websdk";
import { baseUrl } from "../../../../../environments/environment";
import { HttpService } from "../../../../global-services/http.service";
import { ToggleNavService } from "../../../dashboard-service/toggle-nav.service";
import { DialogComponent } from "../../dialog/dialog.component";

@Component({
  selector: "app-identity-verification",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./identity-verification.component.html",
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ["./identity-verification.component.scss"],
})
export class IdentityVerificationComponent implements OnInit {
  @Input() data: any;
  currentId = 1;
  loading: boolean = false;
  userData: any = this.service.getProfileMessage();
  error: boolean = false;

  constructor(
    private service: ToggleNavService,
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  openDialog() {
    this.dialog.closeAll();
    this.dialog.open(DialogComponent, {
      data: {
        type: "dialog",
        data: { requestType: "upload", data: "" },
      },
    });
  }

  getRefreshToken() {
    this.error = false;
    this.loading = true;

    this.httpService.getAuthSingle(baseUrl.advanceVerification).subscribe(
      (data: any) => {
        this.loading = false;
        this.error = false;

        window.location.href = `${data?.data?.url}`;

        // this.launchWebSdk(data?.data?.token);
      },
      (err) => {
        this.loading = false;
        this.error = true;
        this.snackBar.open(
          err?.error?.message ||
            err?.error?.msg ||
            err?.error?.detail ||
            err?.error?.status ||
            "An error occured!",
          "x",
          {
            duration: 5000,
            panelClass: "error",
            horizontalPosition: "center",
            verticalPosition: "top",
          }
        );
      }
    );
  }

  /**
   * @param accessToken - access token that you generated on the backend in Step 2
   * @param applicantEmail - applicant email (not required)
   * @param applicantPhone - applicant phone, if available (not required)
   * @param customI18nMessages - customized locale messages for current session (not required)
   */
  launchWebSdk(access_token: string) {
    let snsWebSdkInstance = snsWebSdk
      .init(
        access_token,
        // token update callback, must return Promise
        // Access token expired
        // get a new one and pass it to the callback to re-initiate the WebSDK
        () => this.getNewAccessToken(access_token)
      )
      .withConf({
        lang: "en", //language of WebSDK texts and comments (ISO 639-1 format)
        email: this.userData?.email,
        phone: this.userData?.phone,
      })
      .withOptions({ addViewportTag: false, adaptIframeHeight: true })
      // see below what kind of messages WebSDK generates
      .on("idCheck.onStepCompleted", () => {
        this.service.setProfileMessage(undefined);
        this.service.profileMessage = undefined;
        this.service.sendIsLoginClickEvent();
      })
      .on("idCheck.actionCompleted", () => {
        this.service.setProfileMessage(undefined);
        this.service.profileMessage = undefined;
        this.service.sendIsLoginClickEvent();
      })
      .build();
    // you are ready to go:
    // just launch the WebSDK by providing the container element for it
    snsWebSdkInstance.launch("#sumsub-websdk-container");
  }

  getNewAccessToken(refresh_token: string) {
    return Promise.resolve(refresh_token);
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  ngOnInit(): void {
    this.userData = this.service.getProfileMessage();
    this.getRefreshToken();
  }
}
