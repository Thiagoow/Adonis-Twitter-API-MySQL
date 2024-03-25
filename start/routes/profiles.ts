import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ProfilesController = () => import('#controllers/Profiles/main')

router.get('/profiles', [ProfilesController, 'show']).use(middleware.auth())
