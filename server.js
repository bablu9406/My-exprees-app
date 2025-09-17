
// Simple Express Server
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World! Your Express app is running on Render.');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
