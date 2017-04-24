import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-ng2fileupload',
  templateUrl: './ng2fileupload.component.html',
  styleUrls: ['./ng2fileupload.component.css']
})
export class Ng2fileuploadComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  private URL = 'http://localhost:3002/api'+'/product_image_add';

  public uploader:FileUploader = new FileUploader({url: this.URL});
  // public hasBaseDropZoneOver:boolean = false;
  // public hasAnotherDropZoneOver:boolean = false;

  // public fileOverBase(e:any):void {
  //   this.hasBaseDropZoneOver = e;
  // }

  // public fileOverAnother(e:any):void {
  //   this.hasAnotherDropZoneOver = e;
  // }

  upload(product_id = 2) {

    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    };

    this.uploader.onBuildItemForm = (fileItem, form) => {
      form.append('product_id', product_id);
      // form.append('image_id', '2');
    };

    this.uploader.uploadAll()
    console.log('ng2-file-upload complete');
  }

  clear() {
    this.uploader.clearQueue()
  }

  test() {
    console.log(this.uploader.queue);
    // this.uploader.uploadAll()
  }


}
