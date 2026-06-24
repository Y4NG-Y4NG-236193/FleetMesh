const express = require("express");
const app = express();

app.use(express.json());

// Health check — required by Docker HEALTHCHECK
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.get("/", (req, res) => {
    res.status(200).send("FleetMesh API is running");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});