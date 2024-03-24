import type { HttpContext } from '@adonisjs/core/http'
import { isFollowing } from '../../utils/is_following.js'
import User from '#models/user'

export default class FollowingController {
  async index({ request, response, auth }: HttpContext) {
    const { username } = request.qs()
    if (!username) {
      return response.badRequest({ error: { message: 'Por favor digite um username' } })
    }
    const user = await User.findByOrFail('username', username)
    await user.load('following')

    const queries = user.following.map(async (userQuery: any) => {
      await isFollowing(userQuery, auth)
    })
    await Promise.all(queries)

    return user.following
  }
}
