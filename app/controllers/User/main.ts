import type { HttpContext } from '@adonisjs/core/http'
import { UpdateValidator } from '#validators/User/Register/update'

export default class MainController {
  async show({ auth }: HttpContext) {
    const user = auth.user!
    return user
  }

  async update({ request, auth }: HttpContext) {
    const data = await request.validateUsing(UpdateValidator)
    const user = auth.user!

    user.merge(data)
    await user.save()
    return user
  }
}
