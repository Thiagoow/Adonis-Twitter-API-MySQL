import vine from '@vinejs/vine'

export const UpdateValidator = vine.compile(
  vine.object({
    file: vine.file({
      size: '10mb',
      extnames: ['jpg', 'png', 'jpeg', 'webp'],
    }),
  })
)
