import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import type { HttpContext } from '@adonisjs/core/http'
import { StoreValidator } from '#validators/Post/Media/store'
import Post from '#models/post'
import fs from 'node:fs'

export default class MediaController {
  async store({ request, response, auth, params }: HttpContext) {
    const { file } = await request.validateUsing(StoreValidator)
    const post = await Post.findOrFail(params.id)

    if (auth.user!.id !== post.userId) {
      return response.unauthorized()
    }

    const media = await post.related('media').create({
      fileCategory: 'post',
      fileName: `${cuid()}.${file.extname}`,
    })
    await file.move(app.tmpPath('uploads'), {
      name: media.fileName,
    })
  }

  async destroy({ response, params, auth }: HttpContext) {
    const post = await Post.findOrFail(params.id)

    if (auth.user!.id !== post.userId) {
      return response.unauthorized()
    }

    const mediaToDelete = await post
      .related('media')
      .query()
      .where('id', params.mediaId)
      .firstOrFail()

    await mediaToDelete.delete()
    fs.unlinkSync(app.tmpPath('uploads', mediaToDelete.fileName))
  }
}
