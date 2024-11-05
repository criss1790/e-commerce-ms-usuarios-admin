import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Permisorol, PermisorolRelations} from '../models';

export class PermisorolRepository extends DefaultCrudRepository<
  Permisorol,
  typeof Permisorol.prototype._id,
  PermisorolRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(Permisorol, dataSource);
  }
}
