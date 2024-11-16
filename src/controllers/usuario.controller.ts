import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Configuracion} from '../llaves/configuracion';
import {CambioClave, Credenciales, CredencialesRecuperarClave, NotificacionCorreo, NotificacionSms, Usuario} from '../models';
import {UsuarioRepository} from '../repositories';
import {AdministradorClavesService, NotificacionesService} from '../services';

export class UsuarioController {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
    @service(AdministradorClavesService)
    public servicioClaves: AdministradorClavesService,
    @service(NotificacionesService)
    public servicioNotificaciones: NotificacionesService
  ) { }

  @post('/usuarios')
  @response(200, {
    description: 'Usuario model instance',
    content: {'application/json': {schema: getModelSchemaRef(Usuario)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {
            title: 'NewUsuario',
            exclude: ['_id'],
          }),
        },
      },
    })
    usuario: Omit<Usuario, '_id'>,
  ): Promise<Usuario> {
    const clave = this.servicioClaves.crearClaveAleatoria();
    console.log(clave)
    const claveCifrada = this.servicioClaves.cifrarTexto(clave);
    usuario.clave = claveCifrada;
    const usuarioCreado = await this.usuarioRepository.create(usuario);
    if (usuarioCreado) {
      const datos = new NotificacionCorreo();
      datos.destinatario = usuario.correo;
      datos.asunto = Configuracion.asuntoCreacionUsuario;
      datos.mensaje = `${Configuracion.saludo} ${usuario.nombre} <br /> ${Configuracion.mensajeCreacionUsuario} ${clave}`;
      this.servicioNotificaciones.enviarCorreo(datos);

    }
    return usuarioCreado;
  }

  @get('/usuarios/count')
  @response(200, {
    description: 'Usuario model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.count(where);
  }

  @get('/usuarios')
  @response(200, {
    description: 'Array of Usuario model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Usuario, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Usuario) filter?: Filter<Usuario>,
  ): Promise<Usuario[]> {
    return this.usuarioRepository.find(filter);
  }

  @patch('/usuarios')
  @response(200, {
    description: 'Usuario PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.updateAll(usuario, where);
  }

  @get('/usuarios/{id}')
  @response(200, {
    description: 'Usuario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Usuario, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Usuario, {exclude: 'where'}) filter?: FilterExcludingWhere<Usuario>
  ): Promise<Usuario> {
    return this.usuarioRepository.findById(id, filter);
  }

  @patch('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.updateById(id, usuario);
  }

  @put('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.replaceById(id, usuario);
  }

  @del('/usuarios/{id}')
  @response(204, {
    description: 'Usuario DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.usuarioRepository.deleteById(id);
  }

  /*
    metodo para identificar un usuario por su correo
  */

  @post('/identificar-usuario')
  @response(200, {
    description: 'identificacion de usuarios',
    content: {'application/json': {schema: getModelSchemaRef(Credenciales)}},
  })
  async identificarUsuario(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Credenciales, {
            title: 'Identificar Usuario',

          }),
        },
      },
    })
    credenciales: Credenciales,
  ): Promise<object | null> {
    const usuario = await this.usuarioRepository.findOne({
      where: {
        correo: credenciales.usuario,
        clave: credenciales.clave

      }
    });
    if (usuario) {
      usuario.clave = '';
      //se retornara un token;
    }
    return usuario;
  }



  @post('/cambiar-clave')
  @response(200, {
    description: 'cambio de clave de usuarios',
    content: {'application/json': {schema: getModelSchemaRef(CambioClave)}},
  })
  async cambiarClave(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Credenciales, {
            title: 'cambio de clave del usuario',

          }),
        },
      },
    })
    credencialesClave: CambioClave,
  ): Promise<Boolean> {
    const usuario = await this.servicioClaves.CambiarClave(credencialesClave);
    if (usuario) {
      const datos = new NotificacionCorreo();
      datos.destinatario = usuario.correo;
      datos.asunto = Configuracion.asuntoCambioClave;
      datos.mensaje = `${Configuracion.saludo} ${usuario.nombre}<br />${Configuracion.mensajeCambioClave}`;
      this.servicioNotificaciones.enviarCorreo(datos);
    }
    return usuario != null;
  }

  @post('/recuperar-clave')
  @response(200, {
    description: 'recuparacion de clave de usuarios',
    content: {'application/json': {schema: {}}},
  })
  async recupaerarClave(
    @requestBody({
      content: {
        'application/json': {


        },
      },
    })
    credenciales: CredencialesRecuperarClave,

  ): Promise<Usuario | null> {
    const usuario = await this.usuarioRepository.findOne({
      where: {
        correo: credenciales.correo,


      }
    });
    if (usuario) {
      const clave = this.servicioClaves.crearClaveAleatoria();
      console.log(clave);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const claveCifrada = this.servicioClaves.cifrarTexto(clave);
      usuario.clave = this.servicioClaves.cifrarTexto(clave);
      await this.usuarioRepository.updateById(usuario._id, usuario);
      const datos = new NotificacionSms();
      datos.destino = usuario.celular;
      datos.mensaje = `${Configuracion.saludo} ${usuario.nombre} <br /> ${Configuracion.mensajeRecuperarClave} ${clave}`;
      this.servicioNotificaciones.enviarSms(datos);

    }
    return usuario;
  }
}
