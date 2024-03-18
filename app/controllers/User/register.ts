import type { HttpContext } from '@adonisjs/core/http'
import { StoreValidator } from '#validators/User/Register/store'
import User from '#models/user'
import UserKey from '#models/user_key'
import { faker } from '@faker-js/faker'
import mail from '@adonisjs/mail/services/main'

export default class RegisterController {
  async store({ request }: HttpContext) {
    const { email, redirectUrl } = await request.validateUsing(StoreValidator)
    const user = await User.create({ email })

    await user.save()
    const key = faker.string.uuid() + user.id
    user.related('keys').create({ key })

    const link = `${redirectUrl.replace(/\/$/, '')}/${key}`

    await mail.send((message) => {
      message.to(email)
      message.from('contato@twitter.com', 'Thiago - Twitter Admin')
      message.subject('Criação de conta')
      message.htmlView('emails/register', { link })
    })
  }

  async show({ params }: HttpContext) {
    const userKey = await UserKey.findByOrFail('key', params.key)
    await userKey.load('user')
    return userKey.user
  }

  async update({}: HttpContext) {}
}
