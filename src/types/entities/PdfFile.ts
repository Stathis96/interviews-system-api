import { Field, InputType } from 'type-graphql'

@InputType()
export class PdfFile {
  @Field()
  name: string

  @Field()
  path: string
}
