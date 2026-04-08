export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://fitness-backend-laoe.onrender.com/api/test",
    );

    if (!response.ok) {
      throw new Error("Backend not OK");
    }

    res.status(200).send("Ping success");
  } catch (err) {
    console.error(err);
    res.status(500).send("Ping failed");
  }
}
