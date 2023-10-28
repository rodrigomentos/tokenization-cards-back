const argon2 = require('argon2')
module.exports = {
  async up(db, client) {
    const passwordHash = await argon2.hash('Rodrigo2023.');
    const user = { username: 'Rodrigo', password: passwordHash }

    await db.collection('users').insertOne(user);
  },

  async down(db, client) {
    await db.collection('users').deleteOne({ username: 'Rodrigo' });
  }
};
