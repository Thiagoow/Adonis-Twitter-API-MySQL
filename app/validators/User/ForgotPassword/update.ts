import vine from '@vinejs/vine'

export const UpdateValidator = vine.compile(
  vine.object({
    key: vine
      .string()
      .trim()
      .exists(async (db, value) => {
        return !!(await db.from('user_keys').where('key', value))
      }),
    password: vine.string().trim().confirmed({ confirmationField: 'passwordConfirmation' }),
  })
)
