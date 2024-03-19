import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class SearchController {
  async index({ request, response, auth }: HttpContext) {
    const { keyword } = request.qs()

    if (!keyword) {
      return response.status(422).send({
        error: { message: 'Digite um usuário para pesquisá-lo' },
      })
    }

    const users = await User.query()
      .where('email', 'like', `%${keyword}%`)
      .orWhere('fullName', 'like', `%${keyword}%`)
      .orWhere('username', 'like', `%${keyword}%`)
      .preload('avatar')

    return users
      .filter(({ id }) => id !== auth.user!.id)
      .map((user) => {
        return user.serialize({
          fields: {
            omit: ['email'],
          },
        })
      })
  }
}
