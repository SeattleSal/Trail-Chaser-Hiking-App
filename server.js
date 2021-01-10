const express = require('express');
const exphbs = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Static Folder
app.use(express.static('app/public'));

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes
// require("./app/routes/api-routes.js")(app);
require('./app/routes/html-routes')(app)

app.listen(PORT, () => {
    console.log(`App listening on PORT: ${PORT}`)
});