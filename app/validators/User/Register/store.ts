import vine from '@vinejs/vine'

export const StoreValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .trim()
      .email()
      .unique(async (db, value) => {
        return !(await db.from('users').where('email', value).first())
      }),
  })
)
