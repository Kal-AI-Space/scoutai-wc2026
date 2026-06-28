export default async function handler(req, res) {
  const { endpoint } = req.query;
  const response = await fetch(
    `https://api.football-data.org/v4/${endpoint}`,
    { headers: { "X-Auth-Token": process.env.FOOTBALL_API_KEY } }
  );
  const data = await response.json();
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json(data);
}
