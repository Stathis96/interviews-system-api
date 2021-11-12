import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return await knex
    .schema
    .createTable('interviews', (table) => {
      table.uuid('interviewId').primary()
      table.datetime('date').notNullable()
      table.string('city', 255).notNullable()
      table.string('area', 255).notNullable()
      table.string('firstName', 255).notNullable()
      table.string('lastName', 255).notNullable()
      table.string('mobile', 15).notNullable()
      table.integer('age').notNullable()
      table.boolean('healthCertificate').notNullable()
      table.boolean('workPermit').notNullable()
      table.boolean('efetSeminars').notNullable()
      table.boolean('vaccinated').notNullable()
      table.integer('doses').nullable()
      table.integer('shifts').notNullable()
      table.string('comments').nullable()
      table.string('toStore').nullable()
      table.string('result').nullable()
      table.text('bio').nullable()
    })
}

export async function down (knex: Knex): Promise<void> {
  return await knex.schema.dropTable('interviews')
}
