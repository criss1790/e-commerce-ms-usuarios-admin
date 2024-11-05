import {Entity, model, property} from '@loopback/repository';

@model()
export class Permisorol extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'string',
  })
  id_rol?: string;

  @property({
    type: 'string',
  })
  id_permiso?: string;

  constructor(data?: Partial<Permisorol>) {
    super(data);
  }
}

export interface PermisorolRelations {
  // describe navigational properties here
}

export type PermisorolWithRelations = Permisorol & PermisorolRelations;
