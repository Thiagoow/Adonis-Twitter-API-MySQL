import vine from '@vinejs/vine'

export const UpdateValidator = vine.compile(
  vine.object({
    username: vine
      .string()
      .trim()
      .unique(async (db, value) => {
        return !(await db.from('users').where('username', value).first())
      }),
    fullName: vine.string().trim(),
  })
)
