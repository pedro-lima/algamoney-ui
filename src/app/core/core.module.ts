import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule, LOCALE_ID } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';

import { ToastyModule } from 'ng2-toasty';
import { ConfirmDialogModule } from 'primeng/components/confirmdialog/confirmdialog';
import { ConfirmationService } from 'primeng/components/common/api';
import { JwtHelper } from 'angular2-jwt';

import { ErrorHandlerService } from './error-handler.service';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada/pagina-nao-encontrada.component';
import { NaoAutorizadoComponent } from './nao-autorizado/nao-autorizado.component';

registerLocaleData(ptBr);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    ToastyModule.forRoot(),
    ConfirmDialogModule
  ],
  declarations: [
    NavbarComponent,
    PaginaNaoEncontradaComponent,
    NaoAutorizadoComponent
  ],
  exports: [
    NavbarComponent,
    ToastyModule,
    ConfirmDialogModule
  ],
  providers: [
    ErrorHandlerService,
    ConfirmationService,
    JwtHelper,
    Title,
    { provide: LOCALE_ID, useValue: 'pt-PT' }
  ]
})
export class CoreModule { }
