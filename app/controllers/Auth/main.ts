import type { HttpContext } from '@adonisjs/core/http'
import { StoreValidator } from '#validators/Auth/store'
import User from '#models/user'

export default class AuthController {
  async store({ request }: HttpContext) {
    const { email, password } = await request.validateUsing(StoreValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return token
  }

  async destroy({ auth }: HttpContext) {
    const user = auth.user!
    await User.accessTokens.delete(user, user.currentAccessToken.tokenableId)
  }
}
