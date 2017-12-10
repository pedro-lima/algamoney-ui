import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { ToastyService } from 'ng2-toasty';

import { Pessoa } from './../models';
import { PessoaService } from '../pessoa.service';
import { ErrorHandlerService } from '../../core/error-handler.service';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {

  pessoa = new Pessoa();

  constructor(
    private pessoaService: PessoaService,
    private errorHandlerService: ErrorHandlerService,
    private toastyService: ToastyService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle('Nova pessoa');

    const codigoPessoa = this.activatedRoute.snapshot.params['codigo'];
    if (codigoPessoa) {
      this.carregarPessoa(codigoPessoa);
    }
  }

  get edidanto() {
    return Boolean(this.pessoa.codigo);
  }

  carregarPessoa(codigo: number) {
    this.pessoaService.buscarPeloCodigo(codigo)
    .then(pessoa => {
      this.pessoa = pessoa;
      this.atualizarTituloEdicao();
    })
    .catch(error => this.errorHandlerService.handle(error));
  }

  salvar(form: FormControl) {
    if (this.edidanto) {
      this.atualizar(form);
    } else {
      this.adicionar(form);
    }
  }

  atualizar(form: FormControl) {
    this.pessoaService.atualizar(this.pessoa)
    .then(pessoa => {
      this.pessoa = pessoa;

      this.toastyService.success('Pessoa alterada com sucesso!');
      this.atualizarTituloEdicao();
    })
    .catch(error => this.errorHandlerService.handle(error));
  }

  adicionar(form: FormControl) {
    this.pessoaService.adicionar(this.pessoa)
      .then(pessoaAdicionada => {
        this.toastyService.success('Pessoa adicionada com sucesso!');

        this.router.navigate(['/pessoas', pessoaAdicionada.codigo]);
      })
      .catch(error => this.errorHandlerService.handle(error));
  }

  novo(form: FormControl) {
    form.reset();
    this.pessoa = new Pessoa();
    this.router.navigate(['/pessoas', 'novo']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição de pessoa: ${this.pessoa.nome}`);
  }

}
