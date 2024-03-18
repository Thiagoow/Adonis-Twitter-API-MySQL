import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const RegisterController = () => import('#controllers/User/register')
const MainController = () => import('#controllers/User/main')

router.post('/users/register', [RegisterController, 'store'])
router.get('/users/register/:key', [RegisterController, 'show'])
router.put('/users/register', [RegisterController, 'update'])

router.get('/users', [MainController, 'show']).use(middleware.auth())
router.put('/users', [MainController, 'update']).use(middleware.auth())
