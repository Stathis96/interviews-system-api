/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { UserInputError } from 'apollo-server-errors'
import { Knex } from 'knex'
import { InterviewInputData } from 'src/types/classes/InterviewInputData'
import { PaginationInputData } from 'src/types/classes/PaginationInputData'
import { Interview } from 'src/types/entities/Interview'
import { PaginatedInterviews } from 'src/types/entities/PaginatedInterviews'
import { v4 } from 'uuid'
import { uploadFileAction } from './FileActions'

export async function getPaginatedInterviewsAction (data: PaginationInputData, connection: Knex): Promise<PaginatedInterviews> {
  const offset = (data.page - 1) * data.limit
  if (data.filter === undefined) data.filter = ''
  const numberOfInterviews = await connection('interviews').count({ count: '*' })

  const interviews = await connection('interviews').limit(data.limit).offset(offset)
    .where('firstName', 'like', `%${(data.filter)}%`)
    .orWhere('lastName', 'like', `%${(data.filter)}%`)
    .orWhere('toStore', 'like', `%${(data.filter)}%`)
    .orWhere('comments', 'like', `%${(data.filter)}%`)
    .orWhere('result', 'like', `%${(data.filter)}%`)

  const prepared = interviews.map(interview => {
    return {
      ...interview,
      comments: JSON.parse(interview.comments),
      toStore: JSON.parse(interview.toStore),
      bio: { path: 'hey', name: 'sth' }
    }
  })

  return { context: prepared, total: numberOfInterviews[0].count as number, offset }
}

export async function getInterviewsAction (connection: Knex): Promise<Interview[]> {
  const interviews = await connection('interviews')

  const prepared = interviews.map(interview => {
    return {
      ...interview,
      comments: JSON.parse(interview.comments),
      toStore: JSON.parse(interview.toStore),
      bio: { path: 'sth', name: 'sth' }
    }
  })
  return prepared
}

export async function getInterviewAction (id: string, connection: Knex): Promise<Interview> {
  const interview = await connection('interviews').where('interviewId', id).first()

  if (interview === undefined) throw new UserInputError('INVALID_INTERVIEW_ID')

  const result: Interview = {
    ...interview,
    comments: JSON.parse(interview.comments),
    toStore: JSON.parse(interview.toStore),
    bio: { path: '', name: 'sth' }
  }
  return result
}

export async function getNullResults (connection: Knex): Promise<Interview[]> {
  const interviews = await connection('interviews').whereNull('result')

  const interviewsWithNull = interviews.map(interview => {
    return {
      ...interview,
      comments: JSON.parse(interview.comments),
      toStore: JSON.parse(interview.toStore),
      bio: { path: '', name: 'sth' }
    }
  })
  return interviewsWithNull
}

export async function createInterviewAction (data: InterviewInputData, connection: Knex): Promise<Interview> {
  const id = v4()
  await connection('interviews')
    .insert({
      interviewId: id,
      ...data,
      comments: JSON.stringify(data.comments), // stringify
      toStore: JSON.stringify(data.toStore) // stringify
    })

  const interview = await connection('interviews').where('interviewId', id).first()
  if (interview === undefined) {
    throw new Error('Interview not found')
  }
  const result: Interview = {
    ...interview,
    comments: JSON.parse(interview.comments),
    toStore: JSON.parse(interview.toStore),
    bio: { path: '', name: 'sth' }
  }
  return result
}

export async function updateInterviewAction (id: string, data: InterviewInputData, connection: Knex): Promise<Interview> {
  await connection('interviews').where('interviewId', id).update({
    ...data,
    comments: JSON.stringify(data.comments), // stringify
    toStore: JSON.stringify(data.toStore) // stringify
  })
  const interview = await connection('interviews').where('interviewId', id).first()
  if (interview === undefined) {
    throw new Error('Interview not found')
  }
  const encodedfile = 'YBcmbtVPkr+JkSHhQbHQMU0uXMMpVcAQjqq4mya4bNJgxB'
  const bio = await uploadFileAction(id, encodedfile, connection)
  return {
    ...interview,
    comments: JSON.parse(interview.comments),
    toStore: JSON.parse(interview.toStore),
    bio: bio
  }
}

export async function deleteInterviewAction (id: string, connection: Knex): Promise<boolean> {
  const interview = await connection('interviews').where('interviewId', id).delete()
  if (interview) return true
  return false
}
