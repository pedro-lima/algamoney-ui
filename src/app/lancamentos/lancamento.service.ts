import { Headers, URLSearchParams, Response } from '@angular/http';
import { Injectable } from '@angular/core';

import * as moment from 'moment';
import { AuthHttp } from 'angular2-jwt';

import { environment } from './../../environments/environment';
import { Lancamento } from './models';
import { LancamentoFiltro } from './filter';

@Injectable()
export class LancamentoService {

  private lancamentosUrl: string;

  constructor(private http: AuthHttp) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
  }

  pesquisar(filtro: LancamentoFiltro): Promise<any> {
    const params = new URLSearchParams();
    params.set('page', filtro.pagina.toString());
    params.set('size', filtro.itensPorPagina.toString());

    if (filtro.descricao) {
      params.set('descricao', filtro.descricao);
    }
    if (filtro.dataVencimentoInicio) {
      params.set('dataVencimentoDe', moment(filtro.dataVencimentoInicio).format('YYYY-MM-DD'));
    }
    if (filtro.dataVencimentoFim) {
      params.set('dataVencimentoAte', moment(filtro.dataVencimentoFim).format('YYYY-MM-DD'));
    }

    // const headers = new Headers();
    // headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.http.get(`${this.lancamentosUrl}?resumo`,
      { search: params })
      .toPromise()
      .then(response => {
        const responseJSON = response.json();
        const lancamentos = responseJSON.content;
        const total = responseJSON.totalElements;

        const resultado = {
          lancamentos,
          total
        };

        return resultado;
      });
  }

  excluir(codigo: number): Promise<void> {
    // const headers = new Headers();
    // headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.http.delete(`${this.lancamentosUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(lancamento: Lancamento): Promise<any> {
    // const headers = new Headers();
    // headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    // headers.append('Content-Type', 'application/json');

    return this.http.post(`${this.lancamentosUrl}`, JSON.stringify(lancamento))
      .toPromise()
      .then((response) => response.json());
  }

  atualizar(lancamento: Lancamento): Promise<any> {
    // const headers = new Headers();
    // headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    // headers.append('Content-Type', 'application/json');

    return this.http.put(`${this.lancamentosUrl}/${lancamento.codigo}`, JSON.stringify(lancamento))
      .toPromise()
      .then((response) => {
        const lancamentoAlterado = response.json() as Lancamento;
        this.converterStringsParaDatas([lancamentoAlterado]);

        return lancamentoAlterado;
      });
  }

  buscarPeloCodigo(codigo: number): Promise<any> {
    // const headers = new Headers();
    // headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.http.get(`${this.lancamentosUrl}/${codigo}`)
      .toPromise()
      .then(response => {
        const lancamento = response.json() as Lancamento;
        this.converterStringsParaDatas([lancamento]);

        return lancamento;
      });
  }

  private converterStringsParaDatas(lancamentos: Lancamento[]) {
    for (const lancamento of lancamentos) {
      if (lancamento.dataPagamento) {
        lancamento.dataPagamento = moment(lancamento.dataPagamento,
          'YYYY-MM-DD').toDate();
      }

      if (lancamento.dataVencimento) {
        lancamento.dataVencimento = moment(lancamento.dataVencimento,
          'YYYY-MM-DD').toDate();
      }
    }
  }

}
