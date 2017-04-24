import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { NgUploaderModule } from 'ngx-uploader';

import { AppComponent } from './app.component';

import { NgxUploadComponent } from './ngx-upload/ngx-upload.component';

import { PrimeNgComponent } from './prime-ng/prime-ng.component';
import {FileUploadModule} from 'primeng/primeng';
import {GrowlModule} from 'primeng/primeng';

import { Ng2fileuploadComponent } from './ng2fileupload/ng2fileupload.component';
import { FileUploadModule as Ng2FileUpload } from 'ng2-file-upload';
import { ImagePreview } from './directive/image-preview.directive';

import { routing } from './app.routing';


@NgModule({
  declarations: [
    AppComponent,
    NgxUploadComponent,
    PrimeNgComponent,
    Ng2fileuploadComponent,
    ImagePreview
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgUploaderModule,
    FileUploadModule,
    GrowlModule,
    Ng2FileUpload,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
