import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Rol, RolRelations, Usuario, Permiso, Permisorol} from '../models';
import {UsuarioRepository} from './usuario.repository';
import {PermisorolRepository} from './permisorol.repository';
import {PermisoRepository} from './permiso.repository';

export class RolRepository extends DefaultCrudRepository<
  Rol,
  typeof Rol.prototype._id,
  RolRelations
> {

  public readonly usuarios: HasManyRepositoryFactory<Usuario, typeof Rol.prototype._id>;

  public readonly tiene_permisos: HasManyThroughRepositoryFactory<Permiso, typeof Permiso.prototype._id,
          Permisorol,
          typeof Rol.prototype._id
        >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('UsuarioRepository') protected usuarioRepositoryGetter: Getter<UsuarioRepository>, @repository.getter('PermisorolRepository') protected permisorolRepositoryGetter: Getter<PermisorolRepository>, @repository.getter('PermisoRepository') protected permisoRepositoryGetter: Getter<PermisoRepository>,
  ) {
    super(Rol, dataSource);
    this.tiene_permisos = this.createHasManyThroughRepositoryFactoryFor('tiene_permisos', permisoRepositoryGetter, permisorolRepositoryGetter,);
    this.registerInclusionResolver('tiene_permisos', this.tiene_permisos.inclusionResolver);
    this.usuarios = this.createHasManyRepositoryFactoryFor('usuarios', usuarioRepositoryGetter,);
    this.registerInclusionResolver('usuarios', this.usuarios.inclusionResolver);
  }
}
