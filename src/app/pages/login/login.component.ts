import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioModel } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  usuario: UsuarioModel;
  recordarme: boolean = false;
  constructor( private _auth: AuthService,
               public router: Router) { }

  ngOnInit() {
    if( localStorage.getItem('token') && this._auth.estaAutenticado() ){
      this.router.navigateByUrl('/home');
    }

    this.usuario = new UsuarioModel();
    if( localStorage.getItem('email') ){
      this.usuario.email = localStorage.getItem('email');
      this.recordarme= true;
    }
  
  }

  login( form: NgForm ){

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

    this._auth.login( this.usuario )
      .subscribe(
        ( resp )=>{
          Swal.close();
          if( this.recordarme ){
            localStorage.setItem('email', this.usuario.email);
          }

          this.router.navigateByUrl('/home');
        },
        ( err ) =>{ 
          Swal.fire({
            title: 'Ups!',
            icon: 'error',
            text: 'El correo o la contraseña son incorretos, por favor vuelve a intentarlo.'
          });
        }
      );

    
    
  }

}
