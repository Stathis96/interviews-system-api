import { IsBoolean, IsDate, IsInt, IsString, Length, Max, Min } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class InterviewInputData {
  @Field()
  @IsDate()
  date: Date

  @Field()
  @IsString()
  city: string

  @Field()
  @IsString()
  area: string

  @Field()
  @IsString()
  firstName: string

  @Field()
  @IsString()
  lastName: string

  @Field()
  @Length(1, 13)
  @IsString()
  mobile: string

  @Field()
  @IsInt()
  @Min(15)
  age: number

  @Field()
  @IsBoolean()
  healthCertificate: boolean

  @Field()
  @IsBoolean()
  workPermit: boolean

  @Field()
  @IsBoolean()
  efetSeminars: boolean

  @Field()
  @IsBoolean()
  vaccinated: boolean

  @Field()
  @IsInt()
  @Min(0)
  @Max(2)
  doses: number

  @Field()
  @IsInt()
  @Min(1)
  @Max(7)
  shifts: number

  @Field(() => [String], { nullable: true })
  comments: string[]

  @Field(() => [String], { nullable: true })
  toStore: string[]

  @Field({ nullable: true })
  @IsString()
  result: string

  @Field()
  @IsString()
  bio: string
}
