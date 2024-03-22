import type { HttpContext } from '@adonisjs/core/http'
import { StoreValidator } from '#validators/Comment/store'
import { UpdateValidator } from '#validators/Comment/update'
import Comment from '#models/comment'
import Post from '#models/post'

export default class CommentsController {
  async store({ request, auth }: HttpContext) {
    const { content, postId } = await request.validateUsing(StoreValidator)
    const post = await Post.findOrFail(postId)

    const comment = await post.related('comments').create({ content, userId: auth.user!.id })
    return comment
  }

  async update({ request, response, auth, params }: HttpContext) {
    const { content } = await request.validateUsing(UpdateValidator)
    const comment = await Comment.findOrFail(params.id)

    if (auth.user!.id !== comment.userId) {
      return response.unauthorized()
    }

    comment.merge({ content })
    await comment.save()
    return comment
  }

  async destroy({ response, auth, params }: HttpContext) {
    const comment = await Comment.findOrFail(params.id)

    if (auth.user!.id !== comment.userId) {
      return response.unauthorized()
    }
    await comment.delete()
  }
}
