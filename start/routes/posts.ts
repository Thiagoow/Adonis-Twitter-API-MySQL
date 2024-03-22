import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const PostsController = () => import('#controllers/Post/main')

router.resource('posts', PostsController).apiOnly().use('*', middleware.auth())
