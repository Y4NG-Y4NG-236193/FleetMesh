const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("FleetMesh API is running");
});

const PORT = 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});