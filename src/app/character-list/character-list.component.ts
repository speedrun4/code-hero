// src/app/components/character-list/character-list.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators'; // Adiciona finalize para garantir que o loading seja atualizado
import { Router } from '@angular/router';
import { MarvelService } from '../marvel.service';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit {
  characters$: Observable<any[]> = new Observable();
  searchName: string = '';
  currentPage: number = 1;
  totalPages: number = 20;
  itemsPerPage: number = 10;
  maxPageButtons: number = 5;
  screenWidth: number; // Propriedade para armazenar a largura da tela
  isLoading = false; // Estado de carregamento

  constructor(private marvelService: MarvelService, private router: Router) {
    this.screenWidth = window.innerWidth; // Inicializa com o valor da largura da tela
  }

  ngOnInit(): void {
    this.loadCharacters();
  }

  // Função para detectar a largura da tela e decidir se é grande
  isLargeScreen(): boolean {
    return this.screenWidth >= 768; // Considera 768px ou mais como tela grande
  }

  loadCharacters(): void {
    this.isLoading = true; // Inicia o carregamento
    const offset = (this.currentPage - 1) * this.itemsPerPage;

    this.characters$ = this.marvelService.getCharacters(this.itemsPerPage, offset, this.searchName).pipe(
      map(data => {
        this.totalPages = Math.ceil(data.data.total / this.itemsPerPage);
        return data.data.results;
      }),
      finalize(() => {
        this.isLoading = false; // Para o carregamento quando a chamada terminar
      })
    );
  }

  onSearch(): void {
    this.currentPage = 1; // Reseta para a primeira página ao buscar
    this.loadCharacters();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadCharacters();
    }
  }

  showDetails(characterId: number): void {
    this.router.navigate(['/character', characterId]);
  }

  getVisiblePages(): number[] {
    let startPage = Math.max(this.currentPage - Math.floor(this.maxPageButtons / 2), 1);
    let endPage = startPage + this.maxPageButtons - 1;

    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(endPage - this.maxPageButtons + 1, 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
  // Adiciona um listener para escutar as mudanças no tamanho da janela
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.screenWidth = window.innerWidth; // Atualiza a largura da tela quando a janela é redimensionada
  }
}
