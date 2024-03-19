import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class ForgotPasswordController {
  async show({ response, params }: HttpContext) {
    return response.download(app.tmpPath('uploads', params.file))
  }
}
