import { InterviewsRow } from 'src/types/interfaces/Rows/InterviewsRow'
import knex from 'knex'
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from './config'

declare module 'knex/types/tables' {
  interface Tables {
    interviews: InterviewsRow
  }
}

export const connection = knex({
  client: 'mysql',
  connection: {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE
  },
  migrations: {
    extension: 'ts'
  }
})
