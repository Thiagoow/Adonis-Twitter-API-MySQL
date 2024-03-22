import type { HttpContext } from '@adonisjs/core/http'
import { StoreValidator } from '#validators/Post/Main/store'
import { UpdateValidator } from '#validators/Post/Main/update'
import Post from '#models/post'
import User from '#models/user'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs'

export default class PostsController {
  async index({ request, auth }: HttpContext) {
    const { username } = request.qs()

    const user = (await User.findBy('username', username)) || auth.user!

    await user.load('posts', (query) => {
      query.orderBy('id', 'desc')
      query.preload('media')
      query.preload('user', (userQuery: any) => {
        userQuery.select(['id', 'fullName', 'username'])
        userQuery.preload('avatar')
      })

      query.withCount('comments')
      query.preload('comments', (commentsQuery: any) => {
        commentsQuery.select(['userId', 'id', 'content', 'createdAt'])
        commentsQuery.preload('user', (userQuery: any) => {
          userQuery.select(['id', 'fullName', 'username'])
          userQuery.preload('avatar')
        })
      })
    })

    return user.posts
  }

  async store({ request, auth }: HttpContext) {
    const data = await request.validateUsing(StoreValidator)
    const post = await auth.user!.related('posts').create(data)
    return post
  }

  async show({ params }: HttpContext) {
    const post = await Post.query()
      .where('id', params.id)
      .preload('user', (query) => {
        query.select(['id', 'fullName', 'username'])
        query.preload('avatar')
      })
      .preload('media')
      .firstOrFail()
    return post
  }

  async update({ request, response, params, auth }: HttpContext) {
    const data = await request.validateUsing(UpdateValidator)
    const post = await Post.findOrFail(params.id)

    if (auth.user!.id !== post.userId) {
      return response.unauthorized()
    }

    await post.merge(data).save()
    return post
  }

  async destroy({ response, params, auth }: HttpContext) {
    const post = await Post.findOrFail(params.id)

    if (auth.user!.id !== post.userId) {
      return response.unauthorized()
    }

    await post.load('media')
    if (post.media) {
      post.media.forEach(async (file) => {
        fs.unlinkSync(app.tmpPath('uploads', file.fileName))
        await file.delete()
      })
    }

    await post.delete()
  }
}
