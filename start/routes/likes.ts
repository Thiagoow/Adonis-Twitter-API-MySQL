import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const LikesController = () => import('#controllers/Likes/main')

router.put('/likes', [LikesController, 'update']).use(middleware.auth())
router.delete('/likes/:id', [LikesController, 'destroy']).use(middleware.auth())
