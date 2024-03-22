// app/validators/user_validator.ts
import vine from '@vinejs/vine'

export const StoreValidator = vine.compile(
  vine.object({
    file: vine.file({
      size: '500mb',
      extnames: ['jpg', 'png', 'jpeg', 'mp4', 'mov', 'gif', 'mkv'],
    }),
  })
)
