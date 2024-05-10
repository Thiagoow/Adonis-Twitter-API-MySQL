import { faker } from '@faker-js/faker'
import db from '@adonisjs/lucid/services/db'
import mail from '@adonisjs/mail/services/main'
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import UserKey from '#models/user_key'
import { StoreValidator } from '#validators/User/Register/store'
import { UpdateValidator } from '#validators/User/Register/update'

export default class RegisterController {
  async store({ request }: HttpContext) {
    await db.transaction(async (trx) => {
      const { email } = await request.validateUsing(StoreValidator)
      const user = new User()
      user.useTransaction(trx)

      await user.save()
      user.merge({ email })
      const key = faker.string.numeric(5) + user.id
      user.related('keys').create({ key })

      await mail.send((message) => {
        message.to(email)
        message.from('contato@twitter.com', 'Thiago - Twitter Admin')
        message.subject('Criação de conta')
        message.htmlView('emails/register', { key })
      })
    })
  }

  async show({ params }: HttpContext) {
    const userKey = await UserKey.findByOrFail('key', params.key)
    await userKey.load('user')
    return userKey.user
  }

  async update({ request, response }: HttpContext) {
    const { key, fullName, password } = await request.validateUsing(UpdateValidator)

    const userKey = await UserKey.findByOrFail('key', key)
    await userKey.load('user')

    const username = fullName.split(' ')[0].toLocaleLowerCase() + new Date().getTime()
    userKey.user.merge({ fullName, password, username })
    await userKey.user.save()

    await userKey.delete()
    return response.ok({ message: 'Usuário atualizado :D' })
  }
}
