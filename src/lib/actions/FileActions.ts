import { Knex } from 'knex'
import { UserInputError } from 'apollo-server-errors'
// import { Interview } from 'src/types/entities/Interview'
import path from 'path'
import fsPromise from 'fs/promises'
import { PdfFile } from 'src/types/entities/PdfFile'

export async function uploadFileAction (id: string, file: string, connection: Knex): Promise<PdfFile> {
  const interview = await connection('interviews').where('interviewId', id).first()

  if (interview === undefined) throw new UserInputError('INVALID_INTERVIEW_ID')

  const filepath = path.join(process.cwd(), `/utils/${interview.firstName}`)

  await fsPromise.readdir(filepath).catch(async () => {
    await fsPromise.mkdir(filepath, {}).catch(e => console.log(e))
  })

  const base64File = file.split(';base64,').pop()
  if (!base64File) throw new Error('Nofile') // check for as not to be undefined.

  await fsPromise.writeFile(`${filepath}/${interview.interviewId}.pdf`, base64File, { encoding: 'base64' }).catch(e => console.log(e))

  // interview.bio.push({
  //   name: `${interview.firstName}${interview.bio.length > 0 ? '-' + interview.bio.length.toString() : ''}`,
  //   path: `${filepath}/${interview.interviewId}${interview.bio.length > 0 ? '-' + interview.bio.length.toString() : ''}.pdf`
  // })

  // interview.bio.push({
  //   name: `${interview.firstName}${interview.bio.length > 0 ? '-' + interview.bio.length.toString() : ''}`,
  //   path: `${filepath}/${interview.interviewId}${interview.bio.length > 0 ? '-' + interview.bio.length.toString() : ''}.pdf`
  // })

  // const decode = Buffer.from(file, 'base64').toString('utf-8')
  // console.log('\n---DECODED-----', decode)

  // const result: Interview = {
  //   ...interview,
  //   comments: JSON.parse(interview.comments),
  //   toStore: JSON.parse(interview.toStore),
  //   bio: {
  //     name: `${interview.firstName}${interview.bio.length > 0 ? '-' + interview.bio.length.toString() : ''}`,
  //     path: `${filepath}/${interview.interviewId}${interview.bio.length > 0 ? '-' + interview.bio.length.toString() : ''}.pdf`
  //   }
  // }
  // console.log(result)
  return {
    name: `${interview.firstName}`,
    path: `${filepath}/${interview.interviewId}.pdf`
  }
}
