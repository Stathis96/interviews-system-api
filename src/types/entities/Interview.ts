import { Field, ID, ObjectType } from 'type-graphql'
import { v4 } from 'uuid'

import { GraphQLJSONObject } from 'graphql-type-json'
import { PdfFile } from './PdfFile'

@ObjectType()
export class Interview {
  @Field(() => ID)
  interviewId: string = v4()

  @Field()
  date: Date

  @Field()
  city: string

  @Field()
  area: string

  @Field()
  firstName: string

  @Field()
  lastName: string

  @Field()
  mobile: string

  @Field()
  age: number

  @Field()
  healthCertificate: boolean

  @Field()
  workPermit: boolean

  @Field()
  efetSeminars: boolean

  @Field()
  vaccinated: boolean

  @Field()
  doses: number

  @Field()
  shifts: number

  @Field(() => [String], { nullable: true })
  comments: string[]

  @Field(() => [String], { nullable: true })
  toStore: string[]

  @Field({ defaultValue: null, nullable: true })
  result: string

  @Field(() => GraphQLJSONObject, { nullable: true })
  bio: PdfFile
}
