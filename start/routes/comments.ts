import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const CommentsController = () => import('#controllers/Comment/main')

router.resource('comments', CommentsController).apiOnly().use('*', middleware.auth())
