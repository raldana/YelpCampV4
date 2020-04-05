const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

const comments = [
    {
        text: "this is a great place",
        author: "Mark Twain"
    },
    {
        text: "too cold here",
        author: "Joe Schmoe"
    },
    {
        text: "I like this place in the mountains",
        author: "John Steinbeck"
    },
    {
        text: "Clean campground at base of Mt. Baldy",
        author: "Ernest Hemingway"
    }
];

const campgrounds = [
    {
        name: "Big Sur",
        image:"https://cdn.pixabay.com/photo/2016/04/28/15/49/airstream-1359135_960_720.jpg",
        description: "Beautiful campground in Big Sur 2"
        // comments: {
        //     text: "this is a great place",
        //     author: "Mark Twain"
        // }
    },
    {
        name: "Gulag Camp",
        image: "https://cdn.pixabay.com/photo/2016/01/26/23/32/camp-1163419_960_720.jpg",
        description: "Russian campground"
        // comments: {
        //     text: "too cold here",
        //     author: "Joe Schmoe"
        // }
    },
    {
        name: "Big Bear",
        image: "https://cdn.pixabay.com/photo/2017/10/07/01/01/bach-leek-2825197_960_720.jpg",
        description: "Campground at Big Bear Mountain"
        // comments: {
        //     text: "I like this place in the mountains",
        //     author: "John Steinbeck"
        // }
    },
    {
        name: "Rancho Cucamonga",
        image: "https://cdn.pixabay.com/photo/2017/07/17/16/21/nature-2512944_960_720.jpg",
        description: "Nice local campground"
        // comments: {
        //     text: "Clean campground at base of Mt. Baldy",
        //     author: "Ernest Hemingway"
        // }
    }
]

let savedComments = [];

async function seedDb() {
    await Comment.deleteMany({})
        .then(() => {
            console.log("removed comments");
            // Comment.insertMany(comments)
            //     .then(() => {
            //         console.log("inserted seed comments");
            //         Comment.find({})
            //         .then((foundComments) => {
            //             foundComments.forEach((comment) => {
            //                 savedComments.push(comment);
            //             })
            //         })
            //         .catch(err => {
            //             console.log(err);
            //         })
            //     })
            //     .catch(err => {
            //         console.log(err);
            //     })
        })
        .catch(err => {
            console.log(err);
        })

    await Comment.insertMany(comments)
        .then(() => {
            console.log("inserted seed comments");
            Comment.find({})
            .then((foundComments) => {
                foundComments.forEach((comment) => {
                    savedComments.push(comment);
                })
            })
            .catch(err => {
                console.log(err);
            })
        })
        .catch(err => {
            console.log(err);
        })

    await Campground.deleteMany({})
        .then(() => {
            console.log("removed campgrounds");
        }).catch((err) => {
            console.log(err);
        })

    await Campground.insertMany(campgrounds)
        .then(() => {
            console.log("inserted seed campgrounds");
        })
        .catch((err) => {
            console.log(err);
        });

    await Campground.find({})
        .then(seedCampgrounds => {
            let arrLength = seedCampgrounds.length;
            for (let i = 0; i < arrLength; i++) {
                let campgroundId = seedCampgrounds[i]._id;
                let commentId = savedComments[i]._id;
                Campground.findByIdAndUpdate({_id: campgroundId}, {comments: commentId})
                    .catch(err => {
                        console.log(err);
                    })
            }
        })
        .catch(err => {
            console.log(err);
    })

};

module.exports = seedDb;