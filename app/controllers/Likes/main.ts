import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'
import Like from '#models/like'
import { UpdateValidator } from '#validators/Like/update'

export default class LikesController {
  async update({ request, auth }: HttpContext) {
    const { postId } = await request.validateUsing(UpdateValidator)
    const post = await Post.findOrFail(postId)

    const searchPayload = { postId, userId: auth.user!.id }
    const like = await post.related('likes').updateOrCreate(searchPayload, {})
    return like
  }

  async destroy({ params }: HttpContext) {
    const like = await Like.findOrFail(params.id)
    await like.delete()
  }
}
