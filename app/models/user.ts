import { DateTime } from 'luxon'
import { withAuthFinder } from '@adonisjs/auth'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, computed, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import UserKey from '#models/user_key'
import File from '#models/file'
import Post from '#models/post'
import Like from '#models/like'
import Retweet from '#models/retweet'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string | null

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

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
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
  })

  @hasMany(() => UserKey)
  declare keys: HasMany<typeof UserKey>

  @hasOne(() => File, {
    foreignKey: 'ownerId',
    onQuery: (query) => query.where('fileCategory', 'avatar'),
  })
  declare avatar: HasOne<typeof File>

  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  @hasMany(() => Like)
  declare likes: HasMany<typeof Like>

  @hasMany(() => Retweet)
  declare retweets: HasMany<typeof Retweet>

  @manyToMany(() => User, {
    pivotTable: 'follows',
    pivotForeignKey: 'following_id',
    pivotRelatedForeignKey: 'follower_id',
  })
  declare followers: ManyToMany<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'follows',
    pivotForeignKey: 'follower_id',
    pivotRelatedForeignKey: 'following_id',
  })
  declare following: ManyToMany<typeof User>

  @computed()
  get postsCount() {
    return this.$extras.posts_count
  }

  @computed()
  get followersCount() {
    return this.$extras.followers_count
  }

  @computed()
  get followingCount() {
    return this.$extras.following_count
  }

  @computed()
  get retweetsCount() {
    return this.$extras.retweets_count
  }
}
