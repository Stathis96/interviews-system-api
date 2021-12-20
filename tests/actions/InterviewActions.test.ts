import { connection } from 'src/dependencies/knex'
import { Knex } from 'knex'
import './setup'
import { getPaginatedInterviewsAction } from 'src/lib/actions/InterviewsActions'

let transaction: Knex.Transaction
beforeEach(async () => {
  transaction = await connection.transaction()
})

afterEach(async () => {
  await transaction.rollback()
})

describe('InterviewActions : getInterviewsAction', () => {
  test('empty', async () => {
    expect.assertions(1)
    const result = await getPaginatedInterviewsAction({ page: 1, limit: 0 }, transaction)

    expect(result).toMatchObject({ context: [], total: 0 })
  })
})
