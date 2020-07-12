const express = require("express");
const session = require("express-session");
const passport = require("./app/config/passport");

const PORT = process.env.PORT || 3000;
const db = require("./app/models");
const exphbs = require("express-handlebars");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./app/public"));

app.use(session({ secret: "change me later", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log("[SERVER] Preparing to check for user.");
    if (req.user) {
        console.log("[SERVER] Found req.user. Details are all follows:");
        console.log(req.user);
        // res.locals.isAuthenticated = req.isAuthenticated();
        res.locals.authenticated = true;
        res.locals.user = req.user;
        // console.log("what even is" + req.locals.isAuthenticated);
    } else {
        console.log("[SERVER] Failed to authenticate the user.");
    }
    next();
});

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// maybe implement dirname later.
app.set("views", "./app/views");

require("./app/routes/html-routes.js")(app);
require("./app/routes/user-api-routes.js")(app);
require("./app/routes/playlist-api-routes.js")(app);

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(
            `Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`,
        );
    });
});
