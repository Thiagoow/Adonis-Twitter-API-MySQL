import vine from '@vinejs/vine'

export const UpdateValidator = vine.compile(
  vine.object({
    content: vine.string().trim().optional(),
  })
)
