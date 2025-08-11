const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();


async function fixAdminIssue() {
  const uri = process.env.DATABASE_URL;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("hospital");
    const users = db.collection("users");

    // Step 1: Normalize Admins
    await users.updateMany(
      { accountType: { $regex: /^admin$/i } },
      { $set: { accountType: "Admin" } }
    );

    // Step 2: Delete duplicate Admins
    const admins = await users.find({ accountType: "Admin" }).toArray();
    if (admins.length > 1) {
      const keepAdmin = admins[0]._id;
      const deleteAdmins = admins.slice(1).map(admin => admin._id);
      await users.deleteMany({ _id: { $in: deleteAdmins } });
      console.log(`Deleted ${deleteAdmins.length} duplicate Admins`);
    } else {
      console.log("Only one Admin exists. No duplicates found.");
    }

    // Step 3: Create unique index
    await users.createIndex(
      { accountType: 1 },
      {
        unique: true,
        partialFilterExpression: { accountType: "Admin" }
      }
    );

    console.log("✅ Admin fix applied successfully");
  } catch (err) {
    console.error("❌ Error fixing Admin issue:", err);
  } finally {
    await client.close();
  }
}

fixAdminIssue();
