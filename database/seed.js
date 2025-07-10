const db = require("./db");
const { Duck, User, Pond } = require("./index");

const seed = async () => {
  db.logging = false;
  await db.sync({ force: true }); // Drop and recreate tables

  const users = await User.bulkCreate([
    { username: "admin", passwordHash: User.hashPassword("password") },
    { username: "user1", passwordHash: User.hashPassword("password") },
    { username: "user2", passwordHash: User.hashPassword("password") },
  ]);

  const pond = await Pond.bulkCreate([
    { name: "North Pond", userId: users[0].id },
    { name: "South Pond", userId: users[1].id },
    { name: "West Pond", userId: users[2].id },
  ]);

  const ducks = await Duck.bulkCreate([
    { name: "James Pond", pondId: pond[0].id },
    { name: "Quakie Chan", pondId: pond[1].id },
    { name: "Goose", pondId: pond[2].id },
  ]);

  console.log(`🦆 Created ${ducks.length} ducks`);

  console.log("🌱 Seeded the database");
  db.close();
};

seed();
