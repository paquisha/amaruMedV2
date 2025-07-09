// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { DefaultCrudRepository } from '@loopback/repository'
import { BelongsToAccessor } from '@loopback/repository'
import { repository } from '@loopback/repository'
import { Option, OptionRelations, Group } from '../models'
import { AmaruMedPgcDataSource } from '../datasources'
import { inject, Getter } from '@loopback/core'
import { GroupRepository } from './group.repository'

export class OptionRepository extends DefaultCrudRepository<
  Option,
  typeof Option.prototype.id,
  OptionRelations
> {
  public readonly group: BelongsToAccessor<Group, typeof Option.prototype.id>

  constructor(
    @inject('datasources.amarumedPGC') dataSource: AmaruMedPgcDataSource,
    @repository.getter('GroupRepository')
    protected groupRepositoryGetter: Getter<GroupRepository>
  ) {
    super(Option, dataSource)
    this.group = this.createBelongsToAccessorFor('group', groupRepositoryGetter)
    this.registerInclusionResolver('group', this.group.inclusionResolver)
  }
}
