import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import * as CryptoJS from "crypto-js";
import {CambioClave, Usuario} from '../models';
import {UsuarioRepository} from '../repositories';
import {repository} from '@loopback/repository';
const generator = require('generate-password');
@injectable({scope: BindingScope.TRANSIENT})


export class AdministradorClavesService {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository
  ) { }

  /*
   * Add service methods here
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  async CambiarClave(credencialesClave: CambioClave): Promise<boolean> {
    const usuario = await this.usuarioRepository.findOne({
      where: {
        _id: credencialesClave.id_usuario,
        clave: credencialesClave.clave_actual

      }
    });
    if (usuario) {
      usuario.clave = credencialesClave.nueva_clave;
      await this.usuarioRepository.updateById(credencialesClave.id_usuario, usuario);
      return true;
    } else {
      return false;
    }

  }

  async recuperarClave(correo: string): Promise<Usuario | null> {
    const usuario = await this.usuarioRepository.findOne({
      where: {
        correo: correo,


      }
    });
    if (usuario) {
      const clave = this.crearClaveAleatoria();
      usuario.clave = this.cifrarTexto(clave);
      await this.usuarioRepository.updateById(usuario._id, usuario);
      return usuario;
    } else {
      return null;
    }

  }


  crearClaveAleatoria(): string {
    const password = generator.generate({
      length: 8,
      numbers: true,
      uppercase: true
    });
    return password;
  }


  cifrarTexto(texto: string) {
    const textoCifrado = CryptoJS.MD5(texto).toString();
    return textoCifrado;

  }
}


