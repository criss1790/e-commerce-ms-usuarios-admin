import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {Response} from 'node-fetch';
import {Configuracion} from '../llaves/configuracion';
import {NotificacionCorreo, NotificacionSms} from '../models';
const fetch = require('node-fetch');

@injectable({scope: BindingScope.TRANSIENT})
export class NotificacionesService {
  constructor(/* Add @inject to inject parameters */) { }

  /*
   * Add service methods here
   */

  enviarCorreo(datos: NotificacionCorreo) {
    const url = `${Configuracion.urlCorreo}?${Configuracion.destinoArg}=${datos.destinatario}&${Configuracion.asuntoArg}=${datos.asunto}&${Configuracion.mensajeArg}=${datos.mensaje}&${Configuracion.hashArg}=${Configuracion.hashNotificacion}`;
    fetch(url)
      .then((res: Response) => {
        console.log(res.text())

      })


  }
  enviarSms(datos: NotificacionSms) {
    const url = `${Configuracion.urlMensajeTexto}?${Configuracion.destinoArg}=${datos.destino}&${Configuracion.mensajeArg}=${datos.mensaje}&${Configuracion.hashArg}=${Configuracion.hashNotificacion}`;
    fetch(url)
      .then((res: Response) => {
        console.log(res.text())

      })


  }
}
