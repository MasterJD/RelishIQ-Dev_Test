import { Component } from '@angular/core';
import { ExternalapiService } from '../../services/externalapi.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ViewChild } from '@angular/core';

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

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Add this

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
      this.total = data.total
    });
  }

  applyFilters(): void {
    this.offset = 0;
    this.loadPhotos();
    this.paginator.firstPage();
  }

  changePage(event: any): void {
    this.offset = event.pageIndex * event.pageSize;
    this.limit = event.pageSize;
    this.loadPhotos();
  }
}
