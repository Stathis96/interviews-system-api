/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable node/no-path-concat */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Ctx, Arg, Query, Resolver, Mutation } from 'type-graphql'
import { Knex } from 'knex'

import { InterviewInputData } from 'src/types/classes/InterviewInputData'
import { PaginationInputData } from 'src/types/classes/PaginationInputData'

import { Interview } from 'src/types/entities/Interview'
import { PdfFile } from 'src/types/entities/PdfFile'
import { PaginatedInterviews } from 'src/types/entities/PaginatedInterviews'

import { createInterviewAction, deleteInterviewAction, getInterviewAction, getInterviewsAction, getNullResults, getPaginatedInterviewsAction, updateInterviewAction } from '../actions/InterviewsActions'
import { deleteFileAction, downloadFileAction } from '../actions/FileActions'

@Resolver()
export class InterviewsResolver {
  @Query(() => PaginatedInterviews)
  async getPaginatedInterviews (
    @Ctx('knex') knex: Knex,
      @Arg('data', () => PaginationInputData) data: PaginationInputData,
      @Arg('status', () => String, { nullable: true }) status?: string
  ): Promise<PaginatedInterviews> {
    return await getPaginatedInterviewsAction(data, knex, status)
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

  @Query(() => String)
  async downloadFile (
    @Ctx('knex') knex: Knex,
      @Arg('id') id: string,
      @Arg('file', () => PdfFile) file: PdfFile
  ): Promise<string> {
    return await downloadFileAction(id, file, knex)
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

  @Mutation(() => Boolean)
  async deleteFile (
    @Arg('file', () => PdfFile) file: PdfFile
  ): Promise<boolean> {
    return await deleteFileAction(file)
  }
}
// @Resolver()
// export class ProfilePictureResolver {
//   @Mutation(() => Boolean)
//   async addProfilePicture (@Arg('picture', () => GraphQLUpload)
//     {
//       createReadStream,
//       filename
//     }: Upload): Promise<boolean> {
//     return await new Promise(async (resolve, reject) =>
//       createReadStream()
//         .pipe(createWriteStream(__dirname + `/../../../utils/${filename}`))
//         .on('finish', () => resolve(true))
//         .on('error', () => reject(false))
//     )
//   }
// }
