#!/usr/bin/env node
/**
 * Script simple para crear un usuario administrador localmente.
 * Uso (PowerShell):
 *  $env:MONGODB_URI='mongodb://localhost:27017/JAC'; $env:ADMIN_EMAIL='admin@local.test'; $env:ADMIN_PASSWORD='admin123'; node scripts/seed-admin.js
 * También acepta parámetros por variables de entorno: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NOMBRE, ADMIN_CEDULA
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function main() {
  const mongo = process.env.MONGODB_URI || 'mongodb://localhost:27017/JAC';
  const email = process.env.ADMIN_EMAIL || 'admin@local.test';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const nombre = process.env.ADMIN_NOMBRE || 'Administrador';
  const cedula = process.env.ADMIN_CEDULA ? Number(process.env.ADMIN_CEDULA) : 99999999;

  console.log('[seed-admin] Conectando a Mongo:', mongo);
  await mongoose.connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true });

  // Modelo flexible que escribe en la colección 'usuarios'
  const Usuario = mongoose.model('Usuario', new mongoose.Schema({}, { strict: false, collection: 'usuarios' }));

  const existing = await Usuario.findOne({ correo: email }).lean().exec();
  if (existing) {
    console.log('[seed-admin] Ya existe un usuario con ese correo:', email);
    console.log(existing);
    await mongoose.disconnect();
    process.exit(0);
  }

  const hashed = await bcrypt.hash(password, 10);
  const usuario = {
    nombre,
    correo: email,
    contraseña: hashed,
    cedula,
    rol: 'admin',
    telefono: '',
  };

  const created = await Usuario.create(usuario);
  console.log('[seed-admin] Administrador creado:', { id: created._id, correo: created.correo, nombre: created.nombre });
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('[seed-admin] Error:', err);
  process.exit(1);
});
