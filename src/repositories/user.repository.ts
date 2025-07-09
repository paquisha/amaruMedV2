// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
  HasOneRepositoryFactory
} from '@loopback/repository'
import { User, UserRelations, Role, Medic } from '../models'
import { AmaruMedPgcDataSource } from '../datasources'
import { inject, Getter } from '@loopback/core'
import { RoleRepository } from './role.repository'
import { MedicRepository } from './medic.repository'

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly role: BelongsToAccessor<Role, typeof User.prototype.id>

  public readonly medic: HasOneRepositoryFactory<Medic, typeof User.prototype.id>

  constructor(
    @inject('datasources.amarumedPGC') dataSource: AmaruMedPgcDataSource,
    @repository.getter('RoleRepository')
    protected roleRepositoryGetter: Getter<RoleRepository>,
    @repository.getter('MedicRepository')
    protected medicRepositoryGetter: Getter<MedicRepository>
  ) {
    super(User, dataSource)
    this.medic = this.createHasOneRepositoryFactoryFor('medic', medicRepositoryGetter)
    this.registerInclusionResolver('medic', this.medic.inclusionResolver)
    this.role = this.createBelongsToAccessorFor('role', roleRepositoryGetter)
    this.registerInclusionResolver('role', this.role.inclusionResolver)
  }
}
