import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterModule],
  templateUrl: './verify-email.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit {
  @Input() data: any;

  constructor(private service: ToggleNavService) {}

  ngOnInit(): void {}

  back() {
    this.service.sendClickEvent({
      requestType: 'request-password',
      password: true,
      email: this.data?.email,
    });
  }

  next() {
    this.service.sendClickEvent({
      requestType: 'otp-form',
      password: true,
      email: this.data?.email,
      isEmail: this.data?.isEmail,
    });
  }
}
