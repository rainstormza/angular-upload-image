import { Component, OnInit } from '@angular/core';
import { NgZone, Inject, EventEmitter } from '@angular/core';
import { NgUploaderOptions, UploadedFile, UploadRejected } from 'ngx-uploader';

@Component({
  selector: 'app-ngx-upload',
  templateUrl: './ngx-upload.component.html',
  styleUrls: ['./ngx-upload.component.css']
})
export class NgxUploadComponent implements OnInit {

  options: NgUploaderOptions;
  response: any;
  sizeLimit: number = 1000000; // 1MB
  previewData: any;
  errorMessage: string;
  startUploadEvent: EventEmitter<string>;

  constructor(@Inject(NgZone) private zone: NgZone) {
    this.options = new NgUploaderOptions({
      url: 'http://api.ngx-uploader.com/upload',
      filterExtensions: true,
      allowedExtensions: ['txt', 'pdf'],
      maxSize: 2097152,
      data:{
        '@type': "File",
        "title": "My lorem.txt file",
        "file": {
          "data": "TG9yZW0gSXBzdW0u",
          "encoding": "base64",
          "filename": "lorem.txt",
          "content-type": "text/plain"
          }
        },
       customHeaders: {
         'Content-Type':'application/json',
         'Accept':'application/json'
      },
      autoUpload: false,
      plainJson: true,
      fieldName: 'file',
      fieldReset: true,
      maxUploads: 2,
      method: 'POST',
      previewUrl: true,
      withCredentials: false
    });

    this.startUploadEvent = new EventEmitter<string>();
  }

  startUpload() {
    this.startUploadEvent.emit("startUpload");
  }

  beforeUpload(ev : Event): void {

    let file: File =  ev.target['files'][0];
    let myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      let tmpB64String = myReader.result.split(',');
      this.options['data']['file']['data'] = tmpB64String[1] ;
      this.options['data']['file']['filename'] = file.name;
      this.options['data']['title'] = file.name;
    }
    myReader.readAsDataURL(file);
  }

  handleUpload(data: any) {
    setTimeout(() => {
      this.zone.run(() => {
        this.response = data;
        if (data && data.response) {
          this.response = JSON.parse(data.response);
        }
      });
    });
  }

  handlePreviewData(data: any) {
    this.previewData = data;
  }

  ngOnInit() {
  }

}
