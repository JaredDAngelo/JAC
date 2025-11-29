#!/usr/bin/env node
// Uso: node scripts/promote-user.js correo@dominio.com
const mongoose = require('mongoose')

async function main() {
  const email = process.argv[2]
  if (!email) {
    console.error('Uso: node scripts/promote-user.js correo@dominio.com')
    process.exit(1)
  }

  // Usar la misma URI que en AppModule (atlas)
  const uri = 'mongodb+srv://JAC:Colombia2025++@cluster0.uy3al.mongodb.net/JAC'
  console.log('[promote-user] conectando a:', uri)
  await mongoose.connect(uri, { dbName: 'JAC' })

  const usuarioSchema = new mongoose.Schema({}, { strict: false })
  const Usuario = mongoose.model('Usuario', usuarioSchema, 'usuarios')

  const u = await Usuario.findOne({ correo: email }).exec()
  if (!u) {
    console.error('[promote-user] usuario no encontrado:', email)
    await mongoose.disconnect()
    process.exit(2)
  }

  u.rol = 'admin'
  await u.save()
  console.log('[promote-user] usuario actualizado a admin:', u._id.toString())
  await mongoose.disconnect()
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(3)
})
