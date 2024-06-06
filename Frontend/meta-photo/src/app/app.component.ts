import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PhotoDisplayComponent } from './components/photo-display/photo-display.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatListModule} from '@angular/material/list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PhotoDisplayComponent,
    MatPaginatorModule,
    MatFormFieldModule,
    MatListModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'meta-photo';
}
