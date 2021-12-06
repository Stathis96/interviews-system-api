import { Knex } from 'knex'
import { UserInputError } from 'apollo-server-errors'
import { Interview } from 'src/types/entities/Interview'

export async function uploadFileAction (id: string, file: string, connection: Knex): Promise<void> {
  const interview = await connection('interviews').where('interviewId', id).first()

  if (interview === undefined) throw new UserInputError('INVALID_INTERVIEW_ID')

  // const encode = Buffer.from(file).toString('base64')
  // console.log('---ENCODED-----', encode)

  const decode = Buffer.from(file, 'base64').toString('utf-8')
  console.log('\n---DECODED-----', decode)

  const result: Interview = {
    ...interview,
    comments: JSON.parse(interview.comments),
    toStore: JSON.parse(interview.toStore),
    bio: { path: decode, name: 'sthfornow' }
  }
}

// export async function uploadFileAction (requestId: string, file: string, em: EntityManager): Promise<void> {
//   const request = await em.findOneOrFail(Request, requestId)

//   const filepath = path.join(process.cwd(), `/attachedFiles/${request.project.id}`)

//   await fsPromise.readdir(filepath).catch(async () => {
//     await fsPromise.mkdir(filepath, {}).catch(e => console.log(e))
//   })

//   const base64File = file.split(';base64,').pop()

//   if (!base64File) return

//   await fsPromise.writeFile(`${filepath}/${request.id}${request.attachedFiles.length > 0 ? '-' + request.attachedFiles.length.toString() : ''}.pdf`, base64File, { encoding: 'base64' }).catch(e => console.log(e))

//   request.attachedFiles.push({
//     name: `${request.project.title}${request.attachedFiles.length > 0 ? '-' + request.attachedFiles.length.toString() : ''}`,
//     path: `${filepath}/${request.id}${request.attachedFiles.length > 0 ? '-' + request.attachedFiles.length.toString() : ''}.pdf`,
//     extension: '.pdf'
//   })
//   await em.flush()
// }
