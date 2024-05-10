import fs from 'node:fs'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import app from '@adonisjs/core/services/app'
import { UpdateValidator } from '#validators/User/Avatar/update'

export default class AvatarController {
  async update({ request, auth, response }: HttpContext) {
    const transactionResponse = await db.transaction(async (trx) => {
      const { file } = await request.validateUsing(UpdateValidator)
      const user = auth.user!.useTransaction(trx)

      const searchPayload = {} //<- ownerId: user.id
      const savePayload = {
        fileName: `${new Date().getTime()}.${file.extname}`,
        //Cria o arquivo na categoria:
        fileCategory: 'avatar' as any,
      }

      const avatar = await user.related('avatar').firstOrCreate(searchPayload, savePayload)
      await file.move(app.tmpPath('uploads'), {
        name: avatar.fileName,
        overwrite: true,
      })

      return response.ok(avatar)
    })

    return transactionResponse
  }

  async destroy({ auth }: HttpContext) {
    await db.transaction(async (trx) => {
      const user = auth.user!.useTransaction(trx)

      const avatar = await user
        .related('avatar')
        .query()
        .where({ fileCategory: 'avatar' })
        .firstOrFail()

      await avatar.delete()
      fs.unlinkSync(app.tmpPath('uploads', avatar.fileName))
    })
  }
}
