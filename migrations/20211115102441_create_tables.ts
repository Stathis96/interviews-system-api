import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return await knex
    .schema
    .createTable('interviews', (table) => {
      table.uuid('interviewId').primary()
      table.datetime('date')
      table.string('city', 255)
      table.string('area', 255)
      table.string('firstName', 255)
      table.string('lastName', 255)
      table.string('mobile', 15)
      table.integer('age')
      table.boolean('healthCertificate')
      table.boolean('workPermit')
      table.boolean('efetSeminars')
      table.boolean('vaccinated')
      table.integer('doses')
      table.integer('shifts')
      table.string('comments')
      table.string('toStore')
      table.string('result').defaultTo(null)
      table.string('bio')
    })
}

export async function down (knex: Knex): Promise<void> {
  return await knex.schema.dropTable('interviews')
}
