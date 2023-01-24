import serviceAccount from "./firebase-key";

const admin = require("firebase-admin");

const firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export default firebase;
