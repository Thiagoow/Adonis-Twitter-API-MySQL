import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const FollowsController = () => import('#controllers/Follows/follow')
const UnfollowController = () => import('#controllers/Follows/unfollow')
const FollowingController = () => import('#controllers/Follows/following')
const FollowersController = () => import('#controllers/Follows/followers')

router.post('/follow', [FollowsController, 'store']).use(middleware.auth())
router.post('/unfollow', [UnfollowController, 'store']).use(middleware.auth())

router.get('/following', [FollowingController, 'index']).use(middleware.auth())

router.get('/followers', [FollowersController, 'index']).use(middleware.auth())
router.delete('/followers/:id', [FollowersController, 'destroy']).use(middleware.auth())
