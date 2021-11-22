import { Ctx, Arg, Query, Resolver, Mutation } from 'type-graphql'
import { Knex } from 'knex'
import { InterviewInputData } from 'src/types/classes/InterviewInputData'
import { Interview } from 'src/types/entities/Interview'
import { createInterviewAction, deleteInterviewAction, getInterviewAction, getInterviewsAction, getNullResults, getPaginatedInterviewsAction, updateInterviewAction } from '../actions/InterviewsActions'
import { PaginationInputData } from 'src/types/classes/PaginationInputData'
import { PaginatedInterviews } from 'src/types/entities/PaginatedInterviews'

@Resolver()
export class InterviewsResolver {
  @Query(() => PaginatedInterviews)
  async getPaginatedInterviews (
    @Ctx('knex') knex: Knex,
      @Arg('data', () => PaginationInputData) data: PaginationInputData
  ): Promise<PaginatedInterviews> {
    return await getPaginatedInterviewsAction(data, knex)
  }

  @Query(() => [Interview])
  async getAllInterviews (
    @Ctx('knex') knex: Knex
  ): Promise <Interview[]> {
    return await getInterviewsAction(knex)
  }

  @Query(() => [Interview])
  async getNullInterviews (
    @Ctx('knex') knex: Knex
  ): Promise <Interview[]> {
    return await getNullResults(knex)
  }

  @Query(() => Interview)
  async getInterview (
    @Ctx('knex') knex: Knex,
      @Arg('id') id: string
  ): Promise <Interview> {
    return await getInterviewAction(id, knex)
  }

  @Mutation(() => Interview)
  async createInterview (
    @Ctx('knex') knex: Knex,
      @Arg('data', () => InterviewInputData) data: InterviewInputData
  ): Promise<Interview> {
    return await createInterviewAction(data, knex)
  }

  @Mutation(() => Interview)
  async updateInterview (
    @Ctx('knex') knex: Knex,
      @Arg('id', () => String) id: string,
      @Arg('data', () => InterviewInputData) data: InterviewInputData
  ): Promise<Interview> {
    return await updateInterviewAction(id, data, knex)
  }

  @Mutation(() => Boolean)
  async deleteInterview (
    @Ctx('knex') knex: Knex,
      @Arg('id', () => String) id: string
  ): Promise<boolean> {
    return await deleteInterviewAction(id, knex)
  }
}
