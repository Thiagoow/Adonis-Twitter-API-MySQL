import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/Auth/main')

router.post('/auth', [AuthController, 'store'])
router.delete('/auth', [AuthController, 'destroy']).use(middleware.auth())
