express = require("express");
cors = require("cors");

const app = express();

app.use(cors());

app.use('/login', (req, res) => {
    res.json({
        token: 'test123'
    });
});

const PORT = 8080;
app.listen(PORT, () => console.log(`API is running on http://localhost:${PORT}/login`));
