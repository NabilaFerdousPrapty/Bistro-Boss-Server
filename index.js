const express = require('express');
const cors = require('cors');
const mongodb = require('mongodb');
const port=process.env.PORT || 5000;
const app = express();

// Middleware
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send('Bistro Boss Server is running');
}   );
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});