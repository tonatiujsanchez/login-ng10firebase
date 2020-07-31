import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioModel } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario: UsuarioModel;
  recordarme:boolean = false;
  constructor( private _auth: AuthService,
               public router:Router ) { }

  ngOnInit() {
    if( localStorage.getItem('token') && this._auth.estaAutenticado() ){
      this.router.navigateByUrl('/home');
    }
    
    this.usuario = new UsuarioModel();
   }

   onSubmit( form: NgForm ){
     
     if( form.invalid ){
       return;
     }

     Swal.fire({ 
      allowOutsideClick: false,
      title: 'Cargando...',
      icon: 'info',
      text: 'Espera por Favor.'
    });
    Swal.showLoading();

     this._auth.nuevoUsuario( this.usuario )
       .subscribe(
         ( resp ) =>{
            Swal.close();
            if( this.recordarme ){
              localStorage.setItem('email', this.usuario.email);
            }
            this.router.navigateByUrl('/home');
         },
         ( err ) =>{
          Swal.fire({
            title: 'Correo existente',
            icon: 'error',
            text: 'Ya existe un cuenta registrada con ese correo.'
          });
         }
     );
   }


}
