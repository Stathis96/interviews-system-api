import knex from 'knex'
import { InterviewsRow } from 'src/types/interfaces/Rows/InterviewsRow'

declare module 'knex/types/tables' {
  interface Tables {
    interviews: InterviewsRow
  }
}

export const connection = knex({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'interviews-system'
  },
  migrations: {
    extension: 'ts'
  }
})
