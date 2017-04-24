import { Component, OnInit } from '@angular/core';
import {Message} from 'primeng/primeng';

@Component({
  selector: 'app-prime-ng',
  templateUrl: './prime-ng.component.html',
  styleUrls: ['./prime-ng.component.css']
})
export class PrimeNgComponent implements OnInit {

  msgs: Message[];
  uploadedFiles: any[] = [];

  constructor() { }

  ngOnInit() {
  }

  onBeforeUpload(event) {
    console.log(event);
    event.formData.append('product_id', 1);
  }

  onUpload(event) {
      for(let file of event.files) {
          this.uploadedFiles.push(file);
      }

      console.log(this.uploadedFiles);

      this.msgs = [];
      this.msgs.push({severity: 'info', summary: 'File Uploaded', detail: 'Yeah'});
  }

}
