import { io } from 'socket.io-client';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InformacionService {

  urlBase: string;
  notificaciones:any[] = [];

  constructor( private http: HttpClient ) { 
    this.urlBase = environment.apiUrl;
  }

  grabarUsuario(name:String){
    return this.http.post(this.urlBase + "/nw-seguridad/usuario/grabar",name);
  }
}