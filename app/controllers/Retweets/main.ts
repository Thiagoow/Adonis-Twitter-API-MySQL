import type { HttpContext } from '@adonisjs/core/http'
import { StoreValidator } from '#validators/Retweet/store'
import Post from '#models/post'
import Retweet from '#models/retweet'

export default class RetweetsController {
  async store({ request, auth }: HttpContext) {
    const { postId } = await request.validateUsing(StoreValidator)
    const post = await Post.findOrFail(postId)

    const searchPayload = { postId, userId: auth.user!.id }
    const retweet = await post.related('retweets').updateOrCreate(searchPayload, {})
    return retweet
  }

  async destroy({ response, auth, params }: HttpContext) {
    const retweet = await Retweet.findOrFail(params.id)
    if (auth.user!.id !== retweet.userId) {
      return response.unauthorized()
    }
    await retweet.delete()
  }
}
