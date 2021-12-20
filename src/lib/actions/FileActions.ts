import { Knex } from 'knex'
import path from 'path'
import fsPromise from 'fs/promises'
import { UserInputError } from 'apollo-server-errors'

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

  const position = interview.bio.search('utils')
  const sliced = interview.bio.slice(position + 7) // check for path validation
  const result = sliced.slice(0, -2)

  const filePosition = file.path.search('utils')
  const filesliced = file.path.slice(filePosition + 6) // check for path validation

  if (result !== filesliced) throw new Error('Cant find file')

  console.log('success')
  const encodedFile = await fsPromise.readFile(
    file.path,
    { encoding: 'base64' }
  ).catch(err => {
    throw new UserInputError(err.message)
  })
  return encodedFile
}

export async function deleteFileAction (file: PdfFile): Promise<boolean> {
  if (file?.path !== undefined) {
    console.log('entered file deletion time')
    fsPromise.unlink(file?.path)
      .then((res: any) => {
        console.log('Successfuly delted filepath', res)
        return true
      })
      .catch((err: string) => {
        console.log('Not deleted', err)
        return false
      })
  }
  return false
}
