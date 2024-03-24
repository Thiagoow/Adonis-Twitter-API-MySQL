import vine from '@vinejs/vine'

export const StoreValidator = vine.compile(
  vine.object({
    followingId: vine.number().exists(async (db, value) => {
      return !!(await db.from('users').where('id', value))
    }),
  })
)
