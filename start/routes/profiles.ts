import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ProfilesController = () => import('#controllers/Profiles/main')
const ProfileLikesController = () => import('#controllers/Profiles/likes')
const ProfileRetweetsController = () => import('#controllers/Profiles/retweets')

router.get('profiles', [ProfilesController, 'show']).use(middleware.auth())
router.get('profiles/likes', [ProfileLikesController, 'show']).use(middleware.auth())
router.get('profiles/retweets', [ProfileRetweetsController, 'show']).use(middleware.auth())
