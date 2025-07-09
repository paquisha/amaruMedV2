// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { HasManyThroughRepositoryFactory } from '@loopback/repository'
import { DefaultCrudRepository } from '@loopback/repository'
import { repository } from '@loopback/repository'
import { Role, RoleRelations, Module, Permission } from '../models'
import { AmaruMedPgcDataSource } from '../datasources'
import { inject, Getter } from '@loopback/core'
import { PermissionRepository } from './permission.repository'
import { ModuleRepository } from './module.repository'

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.id,
  RoleRelations
> {
  public readonly modules: HasManyThroughRepositoryFactory<
    Module,
    typeof Module.prototype.id,
    Permission,
    typeof Role.prototype.id
  >

  constructor(
    @inject('datasources.amarumedPGC') dataSource: AmaruMedPgcDataSource,
    @repository.getter('PermissionRepository')
    protected permissionRepositoryGetter: Getter<PermissionRepository>,
    @repository.getter('ModuleRepository')
    protected moduleRepositoryGetter: Getter<ModuleRepository>
  ) {
    super(Role, dataSource)
    this.modules = this.createHasManyThroughRepositoryFactoryFor(
      'modules',
      moduleRepositoryGetter,
      permissionRepositoryGetter
    )
  }
}
