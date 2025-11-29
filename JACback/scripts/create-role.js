const mongoose = require('mongoose')

const uri = 'mongodb+srv://JAC:Colombia2025++@cluster0.uy3al.mongodb.net/JAC'

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: { type: [String], default: [] },
  description: { type: String }
}, { collection: 'roles' })

const Role = mongoose.model('Role', roleSchema)

async function main() {
  const args = process.argv.slice(2)
  const name = args[0] || 'admin'
  const permsArg = args[1]
  const permissions = permsArg ? permsArg.split(',') : ['read', 'write', 'delete', 'manage_users', 'manage_roles']
  const description = args[2] || 'Rol administrativo con permisos completos'

  console.log('[create-role] conectando a:', uri)
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

  const existing = await Role.findOne({ name }).exec()
  if (existing) {
    console.log('[create-role] rol ya existe:', existing._id.toString())
    existing.permissions = Array.from(new Set([...(existing.permissions || []), ...permissions]))
    existing.description = description
    await existing.save()
    console.log('[create-role] rol actualizado')
  } else {
    const r = new Role({ name, permissions, description })
    const created = await r.save()
    console.log('[create-role] rol creado:', created._id.toString())
  }

  await mongoose.disconnect()
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
