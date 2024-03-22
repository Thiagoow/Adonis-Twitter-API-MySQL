import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Post from '#models/post'

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare content: string

  @column({ serializeAs: null })
  declare userId: number

  @column({ serializeAs: null })
  declare postId: number

  @column.dateTime({
    autoCreate: true,
    serialize: (date: DateTime) => date.toFormat('dd/MM/yyyy HH:mm:ss'),
  })
  declare createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (date: DateTime) => date.toFormat('dd/MM/yyyy HH:mm:ss'),
  })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>
}
