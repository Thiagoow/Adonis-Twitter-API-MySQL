import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class ProfileLikesController {
  async show({ request, auth }: HttpContext) {
    const { username } = request.qs()

    const user = await User.query()
      .where(username ? { username } : { username: auth.user!.username })
      .preload('avatar')
      .preload('likes', (likesQuery: any) => {
        likesQuery.preload('post', (postsQuery: any) => {
          postsQuery.preload('media')
          postsQuery.preload('user', (userQuery: any) => {
            userQuery.select(['id', 'fullName', 'username'])
            userQuery.preload('avatar')
          })
        })
      })
      .firstOrFail()

    return user.serialize({
      fields: {
        omit: ['email', 'createdAt', 'updatedAt', 'rememberMeToken'],
      },
    })
  }
}
