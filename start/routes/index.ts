/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import './auth.ts'
import './users.ts'
import './uploads.ts'
import './posts.ts'
import './comments.ts'
import './likes.ts'
import './follows.ts'
import './profiles.ts'
import './retweets.ts'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.on('/register').render('emails/register', { link: 'http://localhost:3333' })
router.on('/forgot-password').render('emails/forgot-password', { link: 'http://localhost:3333' })
