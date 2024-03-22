import vine from '@vinejs/vine'

export const StoreValidator = vine.compile(
  vine.object({
    content: vine.string().trim().optional(),
  })
)
