import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {HttpClientModule } from '@angular/common/http';
import {MatTableModule} from '@angular/material/table';
import {MatDividerModule} from '@angular/material/divider';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
} from 'ngx-perfect-scrollbar';

// Import routing module
import { AppRoutingModule } from './app-routing.module';

// Import app component
import { AppComponent } from './app.component';

// Import containers
import {
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
} from './containers';



import {
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FooterModule,
  FormModule,
  GridModule,
  HeaderModule,
  ListGroupModule,
  NavModule,
  ProgressModule,
  SharedModule,
  SidebarModule,
  TabsModule,
  UtilitiesModule,

} from '@coreui/angular';

import { IconModule, IconSetService } from '@coreui/icons-angular';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

const APP_CONTAINERS = [
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
];

@NgModule({
  declarations: [AppComponent, ...APP_CONTAINERS],
  imports: [
    BrowserAnimationsModule, // required animations module
    BrowserModule,
    MatTableModule,
    MatPaginatorModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    HttpClientModule,
    MatCheckboxModule,
    MatDialogModule,
    NgxDatatableModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule,
    FormsModule,
    MatIconModule,
    AppRoutingModule,
    AvatarModule,
    BreadcrumbModule,
    FooterModule,
    DropdownModule,
    GridModule,
    HeaderModule,
    SidebarModule,
    IconModule,
    PerfectScrollbarModule,
    NavModule,
    ButtonModule,
    FormModule,
    UtilitiesModule,
    ButtonGroupModule,
    ReactiveFormsModule,
    SidebarModule,
    SharedModule,
    TabsModule,
    ListGroupModule,
    ProgressModule,
    BadgeModule,
    ListGroupModule,
    CardModule,
   
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    IconSetService,
    Title
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
