// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

require('dotenv').config()
import { inject } from '@loopback/core'
import { Application } from '../application'
import { PermissionRepository } from '../repositories'
import { CompanyRepository } from '../repositories'
import { ProfileRepository } from '../repositories'
import { ModuleRepository } from '../repositories'
import { OptionRepository } from '../repositories'
import { GroupRepository } from '../repositories'
import { RoleRepository } from '../repositories'
import { UserRepository } from '../repositories'
import { PasswordBindings } from '../keys'
import { BcryptHasher } from '../services'
import { DEFAULT_PERMISSIONS } from '.'
import { DEFAULT_ADMIN_ROLE } from '.'
import { DEFAULT_PROFILE } from '.'
import { DEFAULT_ADMIN } from '.'
import { MODULES } from '.'
import { OPTIONS } from '.'
import { GROUPS } from '.'
import { ROLES } from '.'
import { User } from '../models'
import { print } from '../utils'

/**
 * Migrate defaults to the database
 */
class Migrate {
  private app: Application
  //private adminRoleId = 0

  @inject(PasswordBindings.ROUNDS) private readonly rounds: number
  public bcrypt: BcryptHasher
  constructor() {
    this.bcrypt = new BcryptHasher(this.rounds)
  }

  /**
   * Migrate database schema and defaults
   */
  public async migrate(existingSchema: 'drop' | 'alter'): Promise<void> {
    await this.initApp()

    // Migrate schema
    await this.createDB(existingSchema)

    print.titlebox('DEFAULTS')

    // Migrate defaults
    await this.saveDefaultCompany()

    const modules = await this.saveDefaultModules()
    this.printValueMigrated('Modules', modules)

    const groups = await this.saveDefaultGroups()
    this.printValueMigrated('Groups', groups)

    const options = await this.saveDefaultOptions()
    this.printValueMigrated('Options', options)

    const roles = await this.saveDefaultRoles()
    this.printValueMigrated('Roles', roles)

    const permissions = await this.saveDefaultPermissions()
    this.printValueMigrated('Permissions', permissions)

    const admin = await this.saveDefaultAdmin()
    this.printValueMigrated('Admin', admin)

    // stop app
    await this.app.stop()
  }

  /**
   * Migrate default company
   */
  private async saveDefaultCompany(): Promise<void> {
    const repo = await this.app.getRepository(CompanyRepository)
    if ((await repo.count()).count === 0) {
      await repo.create({
        name: 'amarumed',
        address: 'Company address',
        primaryColor: '#85c1e9',
        secondaryColor: '#76d7c4'
      })
    }
  }

  /**
   * Migrate defaults modules
   */
  private async saveDefaultModules(): Promise<object | undefined> {
    const repo: ModuleRepository = await this.app.getRepository(ModuleRepository)
    const saved: object[] = []

    for (const element of MODULES) {
      if (!(await repo.exists(element.id))) {
        const result = await repo.create(element)
        saved.push({
          id: result.id,
          name: result.name
        })
      }
    }

    return saved.length > 0 ? saved : undefined
  }

  /**
   * Migrate default groups
   */
  private async saveDefaultGroups(): Promise<object | undefined> {
    const repo = await this.app.getRepository(GroupRepository)

    const saved: object[] = []

    for (const element of GROUPS) {
      if (!(await repo.exists(element.id))) {
        {
          const result = await repo.create(element)
          saved.push({
            id: result.id,
            name: result.name
          })
        }
      }
    }
    return saved.length > 0 ? saved : undefined
  }

  /**
   * Migrate default options.
   */
  private async saveDefaultOptions(): Promise<object | undefined> {
    const repo = await this.app.getRepository(OptionRepository)

    const saved: object[] = []

    for (const element of OPTIONS) {
      const stored = await repo.findOne({
        where: { and: [{ name: element.name }, { groupId: element.groupId }] }
      })

      if (!stored) {
        {
          const result = await repo.create(element)
          saved.push({
            id: result.id,
            groupId: result.groupId,
            name: result.name
          })
        }
      }
    }
    return saved.length > 0 ? saved : undefined
  }

  /**
   * Migrate default roles.
   */
  private async saveDefaultRoles(): Promise<object | undefined> {
    const repo = await this.app.getRepository(RoleRepository)

    const saved: object[] = []

    for (const element of ROLES) {
      const stored = await repo.findOne({ where: { name: element.name } })

      if (!stored) {
        {
          const result = await repo.create(element)
          saved.push({
            id: result.id,
            name: result.name,
            description: result.description
          })
        }
      }
    }
    return saved.length > 0 ? saved : undefined
  }

  /**
   * Migrate default admin user.
   */
  private async saveDefaultAdmin(): Promise<object | undefined> {
    const roleRepo = await this.app.getRepository(RoleRepository)
    const userRepo = await this.app.getRepository(UserRepository)
    const profileRepo = await this.app.getRepository(ProfileRepository)
    const saved: { profile?: object; user?: object } = {}

    const stored = await userRepo.findOne({ where: { email: DEFAULT_ADMIN.email } })

    if (!stored) {
      const roleRst = await roleRepo.findOne({ where: { name: DEFAULT_ADMIN_ROLE.name } })
      const profileRst = await profileRepo.create(DEFAULT_PROFILE)

      if (roleRst && profileRst) {
        const admin: User = DEFAULT_ADMIN
        const password: string = admin.password ?? ''
        admin.password = await this.bcrypt.encrypt(password)
        admin.roleId = roleRst.id ?? 0
        admin.profileId = profileRst.id ?? 0
        const userRst = await userRepo.create(admin)
        saved.user = { id: userRst.id, emailAddress: userRst.email, password }
        saved.profile = { lastName: profileRst.lastName, firstName: profileRst.firstName }
      }
    }

    return saved.user && saved.profile ? saved : undefined
  }

  /**
   * Migrate defaults permissions
   */
  private async saveDefaultPermissions(): Promise<object | undefined> {
    const repo: PermissionRepository = await this.app.getRepository(PermissionRepository)
    const roleRepo = await this.app.getRepository(RoleRepository)
    const saved: object[] = []

    const adminRole = await roleRepo.findOne({ where: { name: DEFAULT_ADMIN_ROLE.name } })

    for (const element of DEFAULT_PERMISSIONS.ADMIN) {
      const stored = await repo.findOne({
        where: { and: [{ roleId: adminRole?.id }, { moduleId: element.moduleId }] }
      })
      if (!stored) {
        element.roleId = adminRole?.id ?? 0
        const result = await repo.create(element)

        saved.push({
          id: result.id,
          roleId: result.roleId,
          moduleId: result.moduleId,
          permission:
            `${result.create ? 'C' : '_'}` +
            `${result.read ? 'R' : '_'}` +
            `${result.edit ? 'U' : '_'}` +
            `${result.del ? 'D' : '_'}`
        })
      }
    }

    return saved.length > 0 ? saved : undefined
  }

  /**
   * Migrate database schema.
   * @param existingSchema
   */
  private async createDB(existingSchema: 'drop' | 'alter'): Promise<void> {
    await this.app.migrateSchema({
      existingSchema,
      models: [
        // simple
        'Company',
        'Patient',
        'Role',
        'Profile',
        'DiseaseType',
        'ExamType',
        'Module',
        'tgroup',

        // with dependencies
        'tuser',
        'Disease',
        'Exam',
        'Permission',
        'Option',
        'Antecedent',
        'Medic',
        'MedicalSpecialty',
        'Specialist',
        'MedicalRecord',
        'Rpe',
        'Cros',
        'VitalSign',
        'Diagnostic',
        'MedicalExam'
      ]
    })
  }

  /**
   * Init the application
   */
  private async initApp(): Promise<void> {
    const app = new Application({})

    await app.boot()
    await app.start()

    this.app = app
  }

  /**
   * Print result from migrate default values.
   * @param title
   * @param migrated
   */
  private printValueMigrated(title: string, migrated?: object) {
    if (migrated) {
      print.titleline(title)

      if (migrated instanceof Array) {
        migrated.forEach(element => {
          console.log(element)
        })
      } else {
        console.log(migrated)
      }
    }
  }
}

/**
 * Migrate defaults to the database
 */
export default async function migrate(args: string[]) {
  const existingSchema = args.includes('--rebuild') ? 'drop' : 'alter'
  console.log('Migrating schemas (%s existing schema)', existingSchema)

  await new Migrate().migrate(existingSchema)

  // Connectors usually keep a pool of opened connections,
  // this keeps the process running even after all work is done.
  // We need to exit explicitly.
  process.exit(0)
}
migrate(process.argv).catch(err => {
  console.error('Cannot migrate database schema', err)
  process.exit(1)
})
