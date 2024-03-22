import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Like extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare postId: number
}
