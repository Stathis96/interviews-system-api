import { Context } from 'koa'
import { Knex } from 'knex'
import { AuthUser } from './AuthUser'

export interface CustomContext {
  ctx: Context

  knex: Knex

  state: {
    user?: AuthUser
  }

  // user?: User
}
