import { Component } from '@angular/core';
import { ExternalapiService } from '../../services/externalapi.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-photo-display',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatFormFieldModule,
    MatListModule,
    FormsModule,
    MatInputModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatToolbar,
  ],
  templateUrl: './photo-display.component.html',
  styleUrl: './photo-display.component.css'
})
export class PhotoDisplayComponent {

  photos: any[] = [];
  titleFilter: string = '';
  albumTitleFilter: string = '';
  userEmailFilter: string = '';
  limit: number = 25;
  offset: number = 0;
  total: number = 0;

  constructor(private apiService: ExternalapiService) {}
  public pageSlice: any;

  loadPhotos(): void {
    const params = {
      title: this.titleFilter,
      'album.title': this.albumTitleFilter,
      'album.user.email': this.userEmailFilter,
      limit: this.limit,
      offset: this.offset
    };

    this.apiService.getPhotos(params).subscribe(data => {
      this.photos = data;
      this.pageSlice = this.photos.slice(0, 10);
    });

  }

  applyFilters(): void {
    this.offset = 0;
    this.loadPhotos();
  }

  OnPageChange(event: any): void {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;

    if(endIndex > this.photos.length){
      endIndex = this.photos.length;
    }
    this.pageSlice = this.photos.slice(startIndex, endIndex);
  }
}
