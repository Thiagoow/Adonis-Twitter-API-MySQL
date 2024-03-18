import vine from '@vinejs/vine'

export const UpdateValidator = vine.compile(
  vine.object({
    key: vine
      .string()
      .trim()
      .exists(async (db, value) => {
        return !!(await db.from('user_keys').where('key', value))
      }),
    username: vine
      .string()
      .trim()
      .unique(async (db, value) => {
        return !(await db.from('users').where('username', value).first())
      }),
    fullName: vine.string().trim(),
    password: vine.string().trim().confirmed({ confirmationField: 'passwordConfirmation' }),
  })
)
