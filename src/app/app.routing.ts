import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/*Component*/
import { PrimeNgComponent } from './prime-ng/prime-ng.component';
import { Ng2fileuploadComponent } from './ng2fileupload/ng2fileupload.component';

const APP_ROUTES: Routes = [
	{path : '', redirectTo: 'primeng', pathMatch:'full'},
  {path : 'primeng',component : PrimeNgComponent},
  {path : 'ng2fileupload',component : Ng2fileuploadComponent },
  // {path : 'contact',component : ContactFComponent },
	{path : '**', redirectTo: '/', pathMatch:'full'},

];

export const routing:ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);
