import { Field, ObjectType } from 'type-graphql'
import { Interview } from './Interview'

@ObjectType()
export class PaginatedInterviews {
  @Field(() => [Interview])
  context: Interview[]

  @Field()
  total: number
}
