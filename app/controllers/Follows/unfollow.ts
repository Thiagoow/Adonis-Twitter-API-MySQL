import type { HttpContext } from '@adonisjs/core/http'
import { StoreValidator } from '#validators/Follows/store'
import User from '#models/user'

export default class UnfollowController {
  async store({ request, auth }: HttpContext) {
    const { followingId } = await request.validateUsing(StoreValidator)
    const user = await User.findOrFail(followingId)
    await user.related('followers').detach([auth.user!.id])
  }
}
