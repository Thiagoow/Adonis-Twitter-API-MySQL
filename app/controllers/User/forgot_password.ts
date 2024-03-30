import type { HttpContext } from '@adonisjs/core/http'
import { StoreValidator } from '#validators/User/ForgotPassword/store'
import { UpdateValidator } from '#validators/User/ForgotPassword/update'
import User from '#models/user'
import UserKey from '#models/user_key'
import { faker } from '@faker-js/faker'
import mail from '@adonisjs/mail/services/main'

export default class ForgotPasswordController {
  async store({ request }: HttpContext) {
    const { email } = await request.validateUsing(StoreValidator)
    const user = await User.findByOrFail('email', email)

    const key = faker.string.numeric(5) + user.id
    user.related('keys').create({ key })

    await mail.send((message) => {
      message.to(email)
      message.from('contato@twitter.com', 'Thiago - Twitter Admin')
      message.subject('Recuperação de senha')
      message.htmlView('emails/forgot-password', { key })
    })
  }

  async show({ params }: HttpContext) {
    const userKey = await UserKey.findByOrFail('key', params.key)
    await userKey.load('user')
    return userKey.user
  }

  async update({ request, response }: HttpContext) {
    const { key, password } = await request.validateUsing(UpdateValidator)
    const userKey = await UserKey.findByOrFail('key', key)

    await userKey.load('user')
    userKey.user.merge({ password })

    await userKey.user.save()
    await userKey.delete()
    return response.ok({ message: 'Senha alterada com sucesso' })
  }
}
