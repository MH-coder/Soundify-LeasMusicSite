const express = require('express');
const path = require("path");
const hbs = require("hbs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");
const adminAuth = require("./middleware/adminAuth");

require('./db/conn');
const Admin = require('./models/adminRegisteration');
const User = require('./models/userRegisteration');
const Post = require('./models/eventPosts');
const History = require('./models/allEventsHistory');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

const staticPath = path.join(__dirname, '../public')
app.use(express.static(staticPath));

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'hbs');

const partialsPath = path.join(__dirname, '../partials');
hbs.registerPartials(partialsPath);

let user, admin;

app.get("/", (req, res) => {
    res.render("login");
})

hbs.registerHelper('isCancelled', function (value) {
    return value == "active";
});

app.get("/home", async (req, res) => {

    res.render("index");

    // const authenticate = await User.findOne({ _id: req.cookies.userId });
    // let posts = Post.find({}, function (err, posts) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     else {
    //         res.render("index", {
    //             name: authenticate,
    //             post: posts
    //         });
    //     }
    // });
})

app.get("/events", async (req, res) => {
    res.render("modern-blog")

    // try {
    //     const authenticate = await User.findOne({ _id: req.cookies.userId });

    //     if (authenticate.registeredEvents.length > 0) {
    //         let arr = [];
    //         for (let i = 0; i < authenticate.registeredEvents.length; i++) {
    //             const element = authenticate.registeredEvents[i];

    //             let posts = Post.find({ _id: authenticate.registeredEvents[i].registeredEvent }, function (err, posts) {
    //                 if (err) {
    //                     console.log(err);
    //                 }
    //                 else {
    //                     arr.push(posts[0]);
    //                     if (i == authenticate.registeredEvents.length - 1) {

    //                         res.render("modern-blog", {
    //                             name: authenticate,
    //                             eventData: arr
    //                         });
    //                     }

    //                 }
    //             });
    //         }
    //     }
    //     else {
    //         res.render("modern-blog", {
    //             name: authenticate,
    //             eventData: []
    //         });
    //     }

    // } catch (error) {
    //     console.log(error);
    // }
})

app.get("/about", async (req, res) => {
    res.render("about")

    // const authenticate = await User.findOne({ _id: req.cookies.userId });

    // let histories = History.find({}, function (err, posts) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     else {
    //         res.render("about", { name: authenticate, history: posts });
    //     }
    // });


})

app.get("/login", (req, res) => {
    res.render("login");
})

app.post("/login", async (req, res) => {
    if (req.body.email == "admin@gmail.com") {
        res.redirect("/adminView");
    } else if (req.body.email == "user@gmail.com") {
        res.redirect("/home");
    }
    // try {
    //     const email = req.body.email;
    //     const password = req.body.password;

    //     let authenticate = await User.findOne({ email: email });

    //     // ADMIN
    //     if (authenticate == null) {
    //         authenticate = await Admin.findOne({ email: email });
    //         const token = await authenticate.generateAdminAuthToken();
    //         res.cookie("jwt", token, {
    //             // expires: new Date(Date.now() + 120000),
    //             httpOnly: true
    //         });

    //         if (authenticate) {
    //             if (authenticate.pass === password) {
    //                 admin = authenticate;
    //                 res.redirect("adminView");
    //             }
    //             else {
    //                 res.send("Invlaid Login!");
    //             }
    //         }
    //         else {
    //             res.send("Invlaid Login!");
    //         }
    //     }
    //     // USER
    //     else {
    //         if (authenticate != null) {
    //             const token = await authenticate.generateUserAuthToken();
    //             res.cookie("jwt", token, {
    //                 // expires: new Date(Date.now() + 120000),
    //                 httpOnly: true
    //             });
    //         }

    //         if (authenticate != null) {

    //             if (authenticate.pass === password) {
    //                 user = authenticate;
    //                 res.cookie("userId", authenticate._id, {
    //                     httpOnly: true
    //                 });

    //                 res.redirect("/home");
    //             }
    //             else {
    //                 res.send("Invlaid Login!");
    //             }
    //         }
    //         else {
    //             res.send("Invlaid Login!");
    //         }
    //     }

    // } catch (error) {
    //     res.status(400).send(error);
    // }

})

app.get("/logout", async (req, res) => {
    try {
        // res.clearCookie("jwt");
        // await req.user.save();
        res.render("login");
    } catch (error) {
        res.status(500).send(error);
    }
})

app.get("/adminLogout", async (req, res) => {
    try {
        // res.clearCookie("jwt");
        // await req.admin.save();
        res.render("login");
    } catch (error) {
        res.status(500).send(error);
    }
})

app.get("/editPost", adminAuth, async (req, res) => {
    try {
        const oldPost = {
            id: req.query.id,
            name: req.query.name,
            desc: req.query.desc,
            artist: req.query.artist,
            date: req.query.date,
            status: req.query.status
        }

        res.render("editPost", {
            oldPost: oldPost
        });
    } catch (error) {
        console.log(error);
    }
})

app.post("/editPost", adminAuth, async (req, res) => {
    try {
        const result = await Post.findByIdAndUpdate({ _id: req.body.eventId }, {
            $set: {
                eventName: req.body.eventName,
                eventDesc: req.body.eventDesc,
                artist: req.body.artistName,
                date: req.body.eventDate,
                eventStatus: req.body.status
            }
        }, {
            useFindAndModify: false
        });


        res.status(201).redirect("/adminView");

    } catch (error) {
        res.status(400).send(error);
    }

})

// Delete Post
app.post("/deletePost", adminAuth, async (req, res) => {
    try {
        if (req.body.status == "cancelled") {
            const result = await Post.deleteOne({ _id: req.body.id });
            res.redirect("/adminView")
        } else {
            res.redirect("/adminView")
        }

    } catch (error) {
        res.status(400).send(error);
    }
})

app.get("/newPost", adminAuth, (req, res) => {
    res.render("createPost");
})

app.post("/newPost", adminAuth, async (req, res) => {
    try {
        const newPost = new Post({
            eventName: req.body.eventName,
            eventDesc: req.body.eventDesc,
            artist: req.body.artistName,
            date: req.body.eventDate,
            eventStatus: req.body.status
        })

        const newHistory = new History({
            eventName: req.body.eventName,
            eventDesc: req.body.eventDesc,
            artist: req.body.artistName,
            date: req.body.eventDate,
            eventStatus: req.body.status
        })

        const registeredHistory = await newHistory.save();
        const registeredPost = await newPost.save();

        res.status(201).redirect("/adminView");
    } catch (error) {
        res.status(400).send(error);
    }

})

app.get("/adminView", (req, res) => {
    // let posts = Post.find({}, function (err, posts) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     else {
    //         console.log(posts);
    //         res.render("adminView", {
    //             name: posts
    //         });
    //     }
    // });
    res.render("adminView");
})

app.post("/adminView", (req, res) => {

})

// Register User in an event
app.get("/reserveSeat", (req, res) => {
})

app.post("/reserveSeat", auth, async (req, res) => {
    const authenticate = await User.findOne({ _id: req.cookies.userId });

    let event = {
        registeredEvent: req.body.eventId,
        regEventName: req.body.eventName,
        eventDesc: req.body.eventDesc,
        artist: req.body.artist,
        date: req.body.date
    };

    authenticate.registeredEvents.push(event);
    authenticate.save();
    res.redirect("/home");
})

app.post("/leaveSeat", auth, async (req, res) => {
    const authenticate = await User.findOne({ _id: req.cookies.userId });

    if (authenticate) {
        for (let i = 0; i < authenticate.registeredEvents.length; i++) {
            const element = authenticate.registeredEvents[i];
            if (element.registeredEvent == req.body.eventId) {
                authenticate.registeredEvents.pull({ _id: element._id });

                authenticate.save();
                res.redirect("/events");
            }
        }
    }
})

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
})