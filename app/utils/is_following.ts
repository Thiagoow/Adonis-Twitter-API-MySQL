import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import { HttpContext } from '@adonisjs/core/http'

export const isFollowing = async (user: User, auth: HttpContext['auth']) => {
  const following = await db.query().from('follows').where('follower_id', auth.user!.id).first()
  user.$extras.following = following ? true : false
}
