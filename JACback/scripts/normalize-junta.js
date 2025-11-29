const mongoose = require('mongoose');

async function main() {
  const uri = 'mongodb+srv://JAC:Colombia2025++@cluster0.uy3al.mongodb.net/JAC';
  await mongoose.connect(uri, { dbName: 'JAC' });
  console.log('[normalize-junta] connected to mongo');

  const Usuario = mongoose.model('Usuario', new mongoose.Schema({}, { strict: false }), 'usuarios');
  const Junta = mongoose.model('Junta', new mongoose.Schema({}, { strict: false }), 'juntas');

  const usuarios = await Usuario.find({}).lean().exec();
  console.log('[normalize-junta] usuarios total:', usuarios.length);

  let fixed = 0;
  for (const u of usuarios) {
    const j = u.junta;
    if (!j) continue;
    // if it's a valid ObjectId (24 hex) skip
    if (typeof j === 'string' && /^[0-9a-fA-F]{24}$/.test(j)) continue;

    // if it's an object with _id, skip
    if (typeof j === 'object' && (j._id || j.id)) continue;

    // now j is a non-object, non-objectId string: try to find a Junta by nombreJunta
    if (typeof j === 'string') {
      const match = await Junta.findOne({ nombreJunta: j }).lean().exec();
      if (match && match._id) {
        await Usuario.updateOne({ _id: u._id }, { $set: { junta: match._id } }).exec();
        console.log('[normalize-junta] mapped usuario', u._id, 'junta name ->', match._id.toString());
        fixed++;
        continue;
      }
    }

    // otherwise clear the field
    await Usuario.updateOne({ _id: u._id }, { $unset: { junta: '' } }).exec();
    console.log('[normalize-junta] cleared invalid junta for usuario', u._id, 'value:', j);
    fixed++;
  }

  console.log('[normalize-junta] done. fixed:', fixed);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
