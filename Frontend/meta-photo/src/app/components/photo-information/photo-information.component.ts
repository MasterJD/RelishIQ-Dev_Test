import { Component, Inject } from '@angular/core';
import { PhotoInfo } from '../photo-display/photo-display.component';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-photo-information',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],

  templateUrl: './photo-information.component.html',
  styleUrl: './photo-information.component.css'
})
export class PhotoInformationComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: PhotoInfo) {}
  
  ngOnInit(){
    console.log(this.data);
  }
}
