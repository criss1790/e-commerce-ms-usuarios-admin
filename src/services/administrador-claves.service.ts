import {injectable, /* inject, */ BindingScope} from '@loopback/core';
const generator = require('generate-password');
import * as CryptoJS from "crypto-js"
@injectable({scope: BindingScope.TRANSIENT})


export class AdministradorClavesService {
  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Add service methods here
   */
  crearClaveAleatoria(): string {
    const password = generator.generate({
      length: 8,
      numbers: true,
      uppercase: true
    });
    return password;
  }


  cifrarTexto(texto: string){
    const textoCifrado = CryptoJS.MD5(texto).toString();
    return textoCifrado;

  }
}


