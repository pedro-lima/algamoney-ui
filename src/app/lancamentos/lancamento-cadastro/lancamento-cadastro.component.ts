import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { ToastyService } from 'ng2-toasty';

import { CategoriaService } from './../../categorias/categoria.service';
import { LancamentoService } from '../lancamento.service';
import { PessoaService } from './../../pessoas/pessoa.service';
import { ErrorHandlerService } from '../../core/error-handler.service';

import { Lancamento } from './../models';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {
  pt_BR: any;

  tipos = [
    { label: 'Receita', value: 'RECEITA' },
    { label: 'Despesa', value: 'DESPESA' },
  ];

  categorias = [];

  pessoas = [];

  lancamento = new Lancamento();

  constructor(
    private lancamentoService: LancamentoService,
    private errorHandlerService: ErrorHandlerService,
    private categoriaService: CategoriaService,
    private pessoaService: PessoaService,
    private toastyService: ToastyService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle('Novo lançamento');

    const codigoLancamento = this.activatedRoute.snapshot.params['codigo'];
    if (codigoLancamento) {
      this.carregarLancamento(codigoLancamento);
    }

    this.carregarLocalizacao();
    this.carregarCategorias();
    this.carregarPessoas();
  }

  carregarLancamento(codigo: number) {
    this.lancamentoService.buscarPeloCodigo(codigo)
      .then(lancamento => {
        this.lancamento = lancamento;
        this.atualizarTituloEdicao();
      })
      .catch(error => this.errorHandlerService.handle(error));
  }

  get edidanto() {
    return Boolean(this.lancamento.codigo);
  }

  carregarLocalizacao() {
    this.pt_BR = {
      firstDayOfWeek: 0,
      dayNames: [ 'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado' ],
      dayNamesShort: [ 'dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb' ],
      dayNamesMin: [ 'D', 'S', 'T', 'Q', 'Q', 'S', 'S' ],
      monthNames: [ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro' ],
      monthNamesShort: [ 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez' ]
    };
  }

  carregarCategorias() {
    this.categoriaService.listarTodas()
      .then(categorias => {
        this.categorias = categorias.map((p) => {
          return { label: p.nome, value: p.codigo };
        });
      })
      .catch(error => this.errorHandlerService.handle(error));
  }

  carregarPessoas() {
    this.pessoaService.listarTodas()
      .then(pessoas => {
        this.pessoas = pessoas.map((c) => {
          return { label: c.nome, value: c.codigo };
        });
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
    this.lancamentoService.atualizar(this.lancamento)
    .then(lancamento => {
      this.lancamento = lancamento;

      this.toastyService.success('Lançamento alterado com sucesso!');
      this.atualizarTituloEdicao();
    })
    .catch(error => this.errorHandlerService.handle(error));
  }

  adicionar(form: FormControl) {
    this.lancamentoService.adicionar(this.lancamento)
      .then(lancamentoAdicionado => {
        this.toastyService.success('Lançamento adicionado com sucesso!');

        this.router.navigate(['/lancamentos', lancamentoAdicionado.codigo]);
      })
      .catch(error => this.errorHandlerService.handle(error));
  }

  novo(form: FormControl) {
    form.reset({ tipo: this.tipos[0].value });
    this.lancamento = new Lancamento();
    this.router.navigate(['/lancamentos', 'novo']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição de lançamento: ${this.lancamento.descricao}`);
  }

}
