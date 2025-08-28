const db = require("./db");
const { Duck, User, Pond } = require("./index");

const seed = async () => {
  try {
    db.logging = false;
    await db.sync({ force: true }); // Drop and recreate tables

    // Create users
    const users = await User.bulkCreate([
      { username: "admin", passwordHash: User.hashPassword("password") },
      { username: "user1", passwordHash: User.hashPassword("password") },
      { username: "user2", passwordHash: User.hashPassword("password") },
    ]);

    // Create ponds
    const ponds = await Pond.bulkCreate([
      { name: "North Pond", userId: users[0].id },
      { name: "South Pond", userId: users[1].id },
      { name: "West Pond", userId: users[2].id },
    ]);

    // Create ducks
    const ducks = await Duck.bulkCreate([
      { name: "James Pond", pondId: ponds[0].id },
      { name: "Quakie Chan", pondId: ponds[1].id },
      { name: "Goose", pondId: ponds[2].id },
    ]);

    console.log(`🦆 Created ${ducks.length} ducks`);

    
    const admin = users[0];
    const adminsDucks = await admin.ducks();
    console.log(
      `Admin's ducks: ${adminsDucks.map((d) => d.name).join(", ")}`
    );

    console.log("🌱 Seeded the database");
  } catch (err) {
    console.error(err);
  } finally {
    await db.close();
  }
};

seed();
