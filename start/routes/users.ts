import router from '@adonisjs/core/services/router'

const RegisterController = () => import('#controllers/User/register')

router.post('/users/register', [RegisterController, 'store'])
router.get('/users/register/:key', [RegisterController, 'show'])
router.put('/users/register', [RegisterController, 'update'])
