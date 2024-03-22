import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, computed, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import File from '#models/file'
import Comment from '#models/comment'
import Like from '#models/like'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare content: string

  @column({ serializeAs: null })
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => File, {
    foreignKey: 'ownerId',
    onQuery: (query) => query.where('fileCategory', 'post'),
  })
  declare media: HasMany<typeof File>

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  @computed()
  get commentsCount() {
    return this.$extras.comments_count
  }

  @hasMany(() => Like)
  declare likes: HasMany<typeof Like>

  @computed()
  get likesCount() {
    return this.$extras.likes_count || 0
  }

  @column.dateTime({
    autoCreate: true,
    serialize: (value: DateTime) => {
      return value.toFormat('dd/MM/yyyy HH:mm:ss')
    },
  })
  declare createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value: DateTime) => {
      return value.toFormat('dd/MM/yyyy HH:mm:ss')
    },
  })
  declare updatedAt: DateTime
}
