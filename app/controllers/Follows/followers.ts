import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class FollowersController {
  async index({ request, response }: HttpContext) {
    const { username } = request.qs()
    if (!username) {
      return response.badRequest({ error: { message: 'Por favor digite um username' } })
    }
    const user = await User.findByOrFail('username', username)
    await user.load('followers')
    return user.followers
  }

  async destroy({ params, auth }: HttpContext) {
    const user = auth.user!
    await user.related('followers').detach([params.id])
  }
}
