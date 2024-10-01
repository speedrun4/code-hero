// src/app/components/character-detail/character-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarvelService } from '../marvel.service';


@Component({
  selector: 'app-character-detail',
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.scss']
})
export class CharacterDetailComponent implements OnInit {
  character: any = null;
  characterId: number = 0;

  constructor(private route: ActivatedRoute, private marvelService: MarvelService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.characterId = +id;
      this.loadCharacterDetails();
    } else {
      // Lida com o caso em que o ID não está presente na URL (ex: redireciona ou define um valor padrão)
      console.error('ID do personagem não encontrado na URL');
      // Redirecionar ou tomar uma ação específica
    }
  }

  loadCharacterDetails(): void {
    this.marvelService.getCharacterDetails(this.characterId).subscribe(data => {
      this.character = data.data.results[0];
    });
  }
}
