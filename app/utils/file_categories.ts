export const fileCategories = ['avatar', 'post'] as const

export type FileCategory = (typeof fileCategories)[number]
