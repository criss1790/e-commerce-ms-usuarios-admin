import {Model, model, property} from '@loopback/repository';

@model()
export class CambioClave extends Model {
  @property({
    type: 'string',
    required: true,
  })
  // eslint-disable-next-line @typescript-eslint/naming-convention
  id_usuario: string;

  @property({
    type: 'string',
    required: true,
  })

  // eslint-disable-next-line @typescript-eslint/naming-convention
  clave_actual: string;

  @property({
    type: 'string',
    required: true,
  })
  // eslint-disable-next-line @typescript-eslint/naming-convention
  nueva_clave: string;


  constructor(data?: Partial<CambioClave>) {
    super(data);
  }
}

export interface CambioClaveRelations {
  // describe navigational properties here
}

export type CambioClaveWithRelations = CambioClave & CambioClaveRelations;
