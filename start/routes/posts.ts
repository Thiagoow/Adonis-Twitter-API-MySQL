import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const PostsController = () => import('#controllers/Post/main')
const PostsMediaController = () => import('#controllers/Post/media')

router.resource('posts', PostsController).apiOnly().use('*', middleware.auth())

router.post('posts/:id/media', [PostsMediaController, 'store']).use(middleware.auth())
router.delete('posts/:id/media/:mediaId', [PostsMediaController, 'destroy']).use(middleware.auth())
