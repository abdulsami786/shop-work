const admin = require("firebase-admin");
const serviceAccount = require("../database/key.json"); // Replace with your Firebase Admin SDK service account key file path
const fs = require("fs");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Read data from the JSON file
const jsonData = JSON.parse(fs.readFileSync("data_GulAhmed.json", "utf-8"));

async function storeDataInFirestore() {
  for (const item of jsonData) {
    try {
      await db.collection("products").add(item);
      console.log("Document successfully written to Firestore!");
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }
}

storeDataInFirestore();
