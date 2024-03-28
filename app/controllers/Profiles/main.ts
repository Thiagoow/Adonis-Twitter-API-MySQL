import type { HttpContext } from '@adonisjs/core/http'
import { isFollowing } from '#utils/is_following'
import User from '#models/user'

export default class ProfilesController {
  async show({ request, auth }: HttpContext) {
    const { username } = request.qs()

    const user = await User.query()
      .where(username ? { username } : { username: auth.user!.username })
      .preload('avatar')
      .preload('posts', (postsQuery: any) => {
        postsQuery.preload('media')
        postsQuery.withCount('likes')
        postsQuery.withCount('comments')
      })
      .preload('followers')
      .preload('following')
      .withCount('posts')
      .withCount('followers')
      .withCount('following')
      .firstOrFail()

    if (user.id !== auth.user!.id) {
      await isFollowing(user, auth)
    }

    return user.serialize({
      fields: {
        omit: ['email', 'createdAt', 'updatedAt', 'rememberMeToken'],
      },
    })
  }
}
