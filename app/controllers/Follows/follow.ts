import type { HttpContext } from '@adonisjs/core/http'
import { StoreValidator } from '#validators/Follows/store'
import User from '#models/user'

export default class FollowController {
  async store({ request, auth, response }: HttpContext) {
    const { followingId } = await request.validateUsing(StoreValidator)
    const user = await User.findOrFail(followingId)

    if (auth.user!.username === user.username) {
      return response.badRequest({ error: { message: 'Não pode seguir você mesmo' } })
    }
    await user.related('followers').attach([auth.user!.id])
  }
}
