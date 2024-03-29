import type { HttpContext } from '@adonisjs/core/http'
import { UpdateValidator } from '#validators/Retweet/store'
import Post from '#models/post'
import Retweet from '#models/retweet'

export default class RetweetsController {
  async update({ request, auth }: HttpContext) {
    const { postId } = await request.validateUsing(UpdateValidator)
    const post = await Post.findOrFail(postId)

    const searchPayload = { postId, userId: auth.user!.id }
    const retweet = await post.related('retweets').updateOrCreate(searchPayload, {})
    return retweet
  }

  async destroy({ response, auth, params }: HttpContext) {
    const retweet = await Retweet.query().where('post_id', params.id).firstOrFail()
    if (auth.user!.id !== retweet?.userId) {
      return response.unauthorized()
    }
    await retweet.delete()
  }
}
