import { Component } from '@angular/core';
import { ExternalapiService } from '../../services/externalapi.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

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
    MatCardModule
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

  ngOnInit(): void {
    this.loadPhotos();
  }

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
      // Adjust the total count if the backend returns it; otherwise, manage it client-side.
    });
  }

  applyFilters(): void {
    this.offset = 0; // Reset offset when filters are applied
    this.loadPhotos();
  }

  changePage(event: any): void {
    this.offset = event.pageIndex * event.pageSize;
    this.limit = event.pageSize;
    this.loadPhotos();
  }
}
