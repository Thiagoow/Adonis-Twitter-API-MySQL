import env from '#start/env'
import { BaseModel, column, computed } from '@adonisjs/lucid/orm'
import type { FileCategory } from '#utils/file_categories'

export default class File extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  declare id: number

  @column({ serializeAs: null })
  declare ownerId: number

  @column({ serializeAs: null })
  declare fileName: string

  @column({ serializeAs: null })
  declare fileCategory: FileCategory

  @computed()
  get url(): string {
    //Retorna a URL para exibição do arquivo no na
    return `${env.get('APP_URL')}/uploads/${this.fileName}`
  }
}
