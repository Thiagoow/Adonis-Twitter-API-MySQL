import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const RegisterController = () => import('#controllers/User/register')
const MainController = () => import('#controllers/User/main')
const ForgotPasswordController = () => import('#controllers/User/forgot_password')
const AvatarController = () => import('#controllers/User/avatar')
const SearchController = () => import('#controllers/User/search')

router.post('/users/register', [RegisterController, 'store'])
router.get('/users/register/:key', [RegisterController, 'show'])
router.put('/users/register', [RegisterController, 'update'])

router.get('/users', [MainController, 'show']).use(middleware.auth())
router.put('/users', [MainController, 'update']).use(middleware.auth())

router.post('/users/forgot-password', [ForgotPasswordController, 'store'])
router.get('/users/forgot-password/:key', [ForgotPasswordController, 'show'])
router.put('/users/forgot-password', [ForgotPasswordController, 'update'])

router.put('/users/avatar', [AvatarController, 'update']).use(middleware.auth())
router.delete('/users/avatar', [AvatarController, 'destroy']).use(middleware.auth())

router.get('/users/search', [SearchController, 'index']).use(middleware.auth())
