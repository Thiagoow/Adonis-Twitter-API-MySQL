import router from '@adonisjs/core/services/router'

const UploadsController = () => import('#controllers/Upload/main')

router.get('/uploads/:file', [UploadsController, 'show'])
