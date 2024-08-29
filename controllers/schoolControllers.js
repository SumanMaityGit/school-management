const db = require("../db");

// List Schools API
const getAllSchools = (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: "Invalid latitude or longitude" });
  }

  const query = "SELECT id, name, address, latitude, longitude FROM schools";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data from database:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    results.forEach((school) => {
      const distance = calculateDistance(
        userLat,
        userLon,
        school.latitude,
        school.longitude
      );
      school.distance = distance;
    });

    results.sort((a, b) => a.distance - b.distance);

    res.json(results);
  });
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// Add School API
const addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const query =
    "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
  const values = [name, address, parseFloat(latitude), parseFloat(longitude)];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error inserting into database:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res
      .status(201)
      .json({ message: "School added successfully", id: results.insertId });
  });
};

module.exports = { getAllSchools, addSchool };
