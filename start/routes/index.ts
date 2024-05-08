/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import './auth.js'
import './users.js'
import './uploads.js'
import './posts.js'
import './comments.js'
import './likes.js'
import './follows.js'
import './profiles.js'
import './retweets.js'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.on('/register').render('emails/register', { key: '123456' })
router.on('/forgot-password').render('emails/forgot-password', { key: '123456' })
