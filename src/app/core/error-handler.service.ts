import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { ToastyService } from 'ng2-toasty';
// import { AuthHttpError } from 'angular2-jwt';
import { NotAuthenticatedError } from '../seguranca/money-http';

@Injectable()
export class ErrorHandlerService {

  constructor(
    private toastyService: ToastyService,
    private router: Router
  ) { }

  handle(errorResponse: any) {
    let msg = '';

    if (typeof errorResponse === 'string') {
      msg = errorResponse;
    } else if (errorResponse instanceof NotAuthenticatedError) {
      msg = 'Sua sessão expirou';
      this.router.navigate(['/login']);
    } else if (errorResponse instanceof Response
      && errorResponse.status >= 400
      && errorResponse.status <= 499) {
        try {
          if (errorResponse.status === 403) {
            msg = 'Você não tem permissão para executar esta ação';
          } else {
            const errorJSON =  errorResponse.json();
            msg = errorJSON[0].mensagemUsuario;
          }
        } catch (err) {
          msg = 'Ocorreu um erro ao processar a sua solicitação';
        } finally {
          console.error('Ocorreu um erro', errorResponse);
        }
    } else {
      msg = 'Erro ao processar serviço remoto. Tente novamente.';
      console.error('Ocorreu um erro', errorResponse);
    }

    this.toastyService.error(msg);
  }

}
