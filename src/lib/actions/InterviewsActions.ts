/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { UserInputError } from 'apollo-server-errors'
import { Knex } from 'knex'
import { InterviewInputData } from 'src/types/classes/InterviewInputData'
import { PaginationInputData } from 'src/types/classes/PaginationInputData'
import { Interview } from 'src/types/entities/Interview'
import { PaginatedInterviews } from 'src/types/entities/PaginatedInterviews'
import { PdfFile } from 'src/types/entities/PdfFile'
import { v4 } from 'uuid'
import { uploadFileAction } from './FileActions'

export async function getPaginatedInterviewsAction (data: PaginationInputData, connection: Knex, status?: string): Promise<PaginatedInterviews> {
  if (status === undefined) {
    const offset = (data.page - 1) * data.limit
    if (data.filter === undefined) data.filter = ''
    const numberOfInterviews = await connection('interviews').count({ count: '*' })
    console.log('number of interviews', numberOfInterviews[0].count)

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
        bio: interview.bio ? JSON.parse(interview.bio) : undefined
      }
    })
    console.log('status undefined')
    return { context: prepared, total: numberOfInterviews[0].count as number, offset }
  } else {
    const offset = (data.page - 1) * data.limit
    if (data.filter === undefined) data.filter = ''
    const numberOfInterviews = await connection('interviews').count({ count: '*' })
      .whereNull('result')
    console.log('number of interviews', numberOfInterviews[0].count)

    const interviews = await connection('interviews').limit(data.limit).offset(offset)
      .where('result', null)
      // .andWhere({'lastName', 'like', `%${(data.filter)}%`  })
      // .orWhere('lastName', 'like', `%${(data.filter)}%`)
      // .orWhere('toStore', 'like', `%${(data.filter)}%`)
      // .orWhere('comments', 'like', `%${(data.filter)}%`)

    const prepared = interviews.map(interview => {
      return {
        ...interview,
        comments: JSON.parse(interview.comments),
        toStore: JSON.parse(interview.toStore),
        bio: interview.bio ? JSON.parse(interview.bio) : undefined
      }
    })
    console.log('status defined')

    return { context: prepared, total: numberOfInterviews[0].count as number, offset }
  }
}

export async function getInterviewsAction (connection: Knex): Promise<Interview[]> {
  const interviews = await connection('interviews')

  const prepared = interviews.map(interview => {
    return {
      ...interview,
      comments: JSON.parse(interview.comments),
      toStore: JSON.parse(interview.toStore),
      bio: JSON.parse(interview.bio)
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
    bio: JSON.parse(interview.bio)
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
      bio: JSON.parse(interview.bio)
    }
  })
  return interviewsWithNull
}

export async function createInterviewAction (data: InterviewInputData, connection: Knex): Promise<Interview> {
  if (data.firstName === '' || data.lastName === '' || data.city === '' || data.area === '') {
    throw new UserInputError('Action Failed! Candidate can not have empty value for his Firstname/Lastname/City/Area')
  }
  const id = v4()
  let bio: PdfFile = { name: '', path: '' }
  // console.log('show data.bio', data.bio)

  await connection('interviews')
    .insert({
      interviewId: id,
      ...data,
      comments: JSON.stringify(data.comments), // stringify
      toStore: JSON.stringify(data.toStore), // stringify
      bio: JSON.stringify(bio)
    })

  if (data.bio) {
    // for (const attachedFile of data.bio) {
    bio = await uploadFileAction(id, data.bio, connection)
  }

  await connection('interviews').where('interviewId', id).update({ // REPEATing the writing to the database in order to update pdf file if exists
    ...data,
    comments: JSON.stringify(data.comments), // stringify
    toStore: JSON.stringify(data.toStore), // stringify
    bio: JSON.stringify(bio)
  })

  const interview = await connection('interviews').where('interviewId', id).first()
  if (interview === undefined) {
    throw new Error('Interview not found')
  }
  const result: Interview = {
    ...interview,
    comments: JSON.parse(interview.comments),
    toStore: JSON.parse(interview.toStore),
    bio: bio
  }
  return result
}

export async function updateInterviewAction (id: string, data: InterviewInputData, connection: Knex): Promise<Interview> {
  let bio: PdfFile = { name: '', path: '' }
  console.log('show what i send', data)
  if (data.bio) {
    if (data.bio !== '') {
      // for (const attachedFile of data.bio) {
      bio = await uploadFileAction(id, data.bio, connection)
      console.log('mpike')
    }
  }

  const interview = await connection('interviews').where('interviewId', id).first()
  if (interview === undefined) {
    throw new Error('Interview not found')
  }
  if (bio.name === '') {
    await connection('interviews').where('interviewId', id).update({
      ...data,
      comments: JSON.stringify(data.comments), // stringify
      toStore: JSON.stringify(data.toStore), // stringify
      bio: interview?.bio
    })
  } else {
    await connection('interviews').where('interviewId', id).update({
      ...data,
      comments: JSON.stringify(data.comments), // stringify
      toStore: JSON.stringify(data.toStore), // stringify
      bio: JSON.stringify(bio)
    })
  }

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
