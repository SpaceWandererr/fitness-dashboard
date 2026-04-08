export default async function handler(req, res) {
  try {
    await fetch("https://fitness-backend-laoe.onrender.com/api/test");
    res.status(200).send("Ping success");
  } catch {
    res.status(500).send("Ping failed");
  }
}
