import type { HttpContext } from '@adonisjs/core/http'
import { StoreValidator } from '#validators/Post/Main/store'
import { UpdateValidator } from '#validators/Post/Main/update'
import Post from '#models/post'
import User from '#models/user'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs'

export default class PostsController {
  async index({ request, response }: HttpContext) {
    const { username, page = 1, size = 10, sort = 'desc' } = request.qs()
    const user = username ? await User.findBy('username', username) : undefined
    const pageParam = Number(page)
    const sizeParam = Number(size)

    if (sizeParam > 100) {
      return response.badRequest({ error: { message: 'Digite um tamanho válido de 1 a 100' } })
    }
    if (sort && !['asc', 'desc'].includes(sort)) {
      return response.badRequest({
        error: { message: "Digite um parâmetro de ordenação válido: 'asc' ou 'desc'" },
      })
    }

    if (!user) {
      const posts = await Post.query()
        .orderBy('id', sort)
        .preload('media')
        .preload('user', (userQuery: any) => {
          userQuery.select(['id', 'fullName', 'username'])
          userQuery.preload('avatar')
        })
        .withCount('comments')
        .withCount('likes')
        .forPage(pageParam, sizeParam)

      return posts
    }

    await user.load('posts', (query) => {
      query.orderBy('id', sort)
      query.preload('media')
      query.preload('user', (userQuery: any) => {
        userQuery.select(['id', 'fullName', 'username'])
        userQuery.preload('avatar')
      })
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
