const mongoose = require('mongoose')

async function main() {
  const email = process.argv[2]
  if (!email) {
    console.error('Uso: node scripts/check-user-role.js correo@dominio.com')
    process.exit(1)
  }

  const uri = 'mongodb+srv://JAC:Colombia2025++@cluster0.uy3al.mongodb.net/JAC'
  console.log('[check-user-role] conectando a:', uri)
  await mongoose.connect(uri, { dbName: 'JAC' })

  const usuarioSchema = new mongoose.Schema({}, { strict: false })
  const Usuario = mongoose.model('Usuario', usuarioSchema, 'usuarios')

  const u = await Usuario.findOne({ correo: email }).lean().exec()
  if (!u) {
    console.error('[check-user-role] usuario no encontrado:', email)
    await mongoose.disconnect()
    process.exit(2)
  }

  console.log('[check-user-role] usuario completo:')
  console.log(JSON.stringify(u, null, 2))
  await mongoose.disconnect()
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(3)
})
