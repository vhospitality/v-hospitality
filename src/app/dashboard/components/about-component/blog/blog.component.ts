import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent {}
