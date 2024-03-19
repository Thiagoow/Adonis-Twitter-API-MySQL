import type { HttpContext } from '@adonisjs/core/http'
import { UpdateValidator } from '#validators/User/Avatar/update'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs'

export default class AvatarController {
  async update({ request, auth, response }: HttpContext) {
    const { file } = await request.validateUsing(UpdateValidator)
    const user = auth.user!

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
  }

  async destroy({ auth }: HttpContext) {
    const user = auth.user!

    const avatar = await user
      .related('avatar')
      .query()
      .where({ fileCategory: 'avatar' })
      .firstOrFail()

    await avatar.delete()
    fs.unlinkSync(app.tmpPath('uploads', avatar.fileName))
  }
}
