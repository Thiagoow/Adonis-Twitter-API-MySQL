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

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.on('/register').render('emails/register', { link: 'http://localhost:3333' })
router.on('/forgot-password').render('emails/forgot-password', { link: 'http://localhost:3333' })
