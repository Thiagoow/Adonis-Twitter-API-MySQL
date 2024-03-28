import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const RetweetsController = () => import('#controllers/Retweets/main')

router.put('/retweets', [RetweetsController, 'update']).use(middleware.auth())
router.delete('/retweets/:id', [RetweetsController, 'destroy']).use(middleware.auth())
