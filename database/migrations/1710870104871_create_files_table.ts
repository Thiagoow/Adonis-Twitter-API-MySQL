import { BaseSchema } from '@adonisjs/lucid/schema'
import { fileCategories } from '#utils/file_categories'

export default class extends BaseSchema {
  protected tableName = 'files'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('owner_id').notNullable()
      table.string('file_name').notNullable()
      table.enum('file_category', fileCategories).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
