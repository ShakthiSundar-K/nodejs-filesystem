const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const folderPath = path.join(__dirname, "files");

// Ensure the folder exists
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

// Endpoint to create a text file with the current timestamp
app.post("/api/create-file", (req, res) => {
  const currentDate = new Date();
  const timestamp = currentDate.toISOString();
  const fileName = `${currentDate.toISOString().replace(/[:.]/g, "-")}.txt`;
  const filePath = path.join(folderPath, fileName);

  fs.writeFile(filePath, timestamp, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error creating file", error: err });
    }
    res.status(201).json({ message: "File created successfully", fileName });
  });
});

// Endpoint to retrieve all text files in the folder
app.get("/api/files", (req, res) => {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error reading files", error: err });
    }
    // Filter only `.txt` files
    const textFiles = files.filter((file) => file.endsWith(".txt"));
    res.json({ files: textFiles });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
