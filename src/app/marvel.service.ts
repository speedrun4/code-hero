// src/app/services/marvel.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class MarvelService {
  private baseUrl = 'https://gateway.marvel.com/v1/public';
  private publicKey = 'b9bd55ffcc709750d27b95920026b431';
  private privateKey = 'c25934591c8e250ae52d15f7604d3dbf522549b5';
  private ts = new Date().getTime();
  private hash = CryptoJS.MD5(this.ts + this.privateKey + this.publicKey).toString();

  constructor(private http: HttpClient) {}

  getCharacters(limit: number, offset: number, nameStartsWith?: string): Observable<any> {
    let url = `${this.baseUrl}/characters?limit=${limit}&offset=${offset}&ts=${this.ts}&apikey=${this.publicKey}&hash=${this.hash}`;

    if (nameStartsWith) {
      url += `&nameStartsWith=${nameStartsWith}`;
    }

    return this.http.get(url);
  }

  getCharacterDetails(id: number): Observable<any> {
    const url = `${this.baseUrl}/characters/${id}?ts=${this.ts}&apikey=${this.publicKey}&hash=${this.hash}`;
    return this.http.get(url);
  }
}
