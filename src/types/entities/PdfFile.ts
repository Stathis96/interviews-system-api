import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class PdfFile {
  @Field()
  name: string

  @Field()
  path: string
}
