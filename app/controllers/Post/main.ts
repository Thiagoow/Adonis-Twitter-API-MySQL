import type { HttpContext } from '@adonisjs/core/http'
import { StoreValidator } from '#validators/Post/Main/store'
import { UpdateValidator } from '#validators/Post/Main/update'
import Post from '#models/post'
import User from '#models/user'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs'

export default class PostsController {
  async index({ request, auth }: HttpContext) {
    const { username, page, size } = request.qs()
    const user = username ? (await User.findBy('username', username))! : auth.user!

    const pageParam = Number(page) || 1
    const sizeParam = Number(size) || 10

    await user.load('posts', (query) => {
      query.orderBy('id', 'desc')
      query.preload('media')
      query.preload('user', (userQuery: any) => {
        userQuery.select(['id', 'fullName', 'username'])
        userQuery.preload('avatar')
      })
      query.withCount('retweets')
      query.withCount('comments')
      query.withCount('likes')
      query.forPage(pageParam, sizeParam)
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
      .preload('comments', (commentsQuery) => {
        commentsQuery.select(['userId', 'id', 'content', 'createdAt', 'updatedAt'])
        commentsQuery.preload('user', (userQuery) => {
          userQuery.select(['id', 'fullName', 'username'])
          userQuery.preload('avatar')
        })
      })
      .preload('likes', (likesQuery) => {
        likesQuery.preload('user', (userQuery) => {
          userQuery.select(['id', 'fullName', 'username'])
          userQuery.preload('avatar')
        })
      })
      .withCount('retweets')
      .withCount('comments')
      .withCount('likes')
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
