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
  if (!base64File) throw new Error('No file got encrypted') // check for as not to be undefined.
  Buffer.from(base64File, 'base64')

  await fsPromise.writeFile(`${filepath}/${interview.interviewId}.pdf`, base64File, { encoding: 'base64' }).catch(e => console.log(e))

  return {
    name: `${interview.firstName}`,
    path: `${filepath}/${interview.interviewId}.pdf`
  }
}

export async function downloadFileAction (id: string, file: PdfFile, connection: Knex): Promise<string> {
  const interview = await connection('interviews').where('interviewId', id).first()
  if (interview === undefined) throw new UserInputError('INVALID_INTERVIEW_ID')

  console.log(interview.bio)
  const position = interview.bio.search('utils')
  const sliced = interview.bio.slice(position)
  const result = sliced.slice(0, -2)
  // result.replace('\\', '/')
  console.log('result ', result)
  console.log('file path', file.path)

  if (result !== file.path) console.log('not equal')
  //  throw new Error('Cant find file')
  // const bio: PdfFile = interview.bio as unknown as PdfFile
  // if (bio.path !== file.path) throw new Error('Cant find file')
  // if (interview.bio !== file.path) throw new Error('Cant find file')
  const encodedFile = await fsPromise.readFile(
    file.path,
    { encoding: 'base64' }
  ).catch(err => {
    throw new UserInputError(err.message)
  })
  // console.log('this is what i send back', encodedFile)
  return encodedFile
}
