import vine from '@vinejs/vine'

export const StoreValidator = vine.compile(
  vine.object({
    postId: vine.number().exists(async (db, value) => {
      return !!(await db.from('posts').where('id', value))
    }),
  })
)
