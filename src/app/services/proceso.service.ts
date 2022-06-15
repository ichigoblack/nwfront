import { io } from 'socket.io-client';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { map } from 'rxjs/operators';
import { authHeader } from './../class/auth-headers'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProcesoService  {

  urlBase: string;
  urlBaseEnvio: string;
  urlBaseEnvioSap: string;
  notificaciones: any[] = [];


  socket = io(environment.apiUrl);
  notificacionesRecibidas: any[] = [];

  constructor(private http: HttpClient) {
    this.urlBase = environment.apiUrl;
    this.urlBaseEnvio = environment.apiUrlEnvio;
    this.urlBaseEnvioSap = environment.apiUrlEnvioSap;
  }

  listaProcesos() {
    return this.http.get<any>(this.urlBase + "/api/atunera/listarTipoProcesos")
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  listaTipoProcesos(id: any) {
    return this.http.get<any>(this.urlBase + `/api/atunera/listarIntegracionesByProceso/${id}`)
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  listarNotificaciones(data: any) {
    return this.http.post<any>(this.urlBase + `/api/integrador/listarNotificaciones`, data)
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  enviarNotificaciones(data: any) {
    //return this.http.post<any>(this.urlBaseEnvioSap + `/api/atunera/sap/enviar`,data,{ headers: authHeader() })
    return this.http.post<any>(this.urlBaseEnvio + `/sap/enviar/NO`, data, { headers: authHeader() })
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  obtenerData(){
    let temp:any
    this.socket.on('connect', () => {
        console.log("conectado!"); 
    });
    this.socket.on('recibir-notificaciones',(notificaciones)=>{
        console.log("notificaciones recibidas services",notificaciones);
        return notificaciones;
    })
    
  }
}