import {Entity, model, property, hasMany} from '@loopback/repository';
import {Usuario} from './usuario.model';
import {Permiso} from './permiso.model';
import {Permisorol} from './permisorol.model';

@model()
export class Rol extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;


  @hasMany(() => Usuario, {keyTo: 'id_rol'})
  usuarios: Usuario[];

  @hasMany(() => Permiso, {through: {model: () => Permisorol, keyFrom: 'id_rol', keyTo: 'id_permiso'}})
  // eslint-disable-next-line @typescript-eslint/naming-convention
  tiene_permisos: Permiso[];

  constructor(data?: Partial<Rol>) {
    super(data);
  }
}

export interface RolRelations {
  // describe navigational properties here
}

export type RolWithRelations = Rol & RolRelations;
