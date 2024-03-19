const Campground = require('../model/campground'); //outside the directory then ..
const cities = require('./cities');
const { descriptors, places} = require('./seedHelpers'); //inside the directory then .
const mongoose = require('mongoose');
const axios = require('axios');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open",()=>{
    console.log("Database connected");
})

const sample = array => array[Math.floor(Math.random()* array.length)];

// async function seedImg() {
//     try {
//       const resp = await axios.get('https://api.unsplash.com/photos/random', {
//         params: {
//           client_id: '****YOUR CLIENT ID GOES HERE****',
//           collections: 1114848,
//         },
//       })
//       return resp.data.urls.small
//     } catch (err) {
//       console.error(err)
//     }
//   }

const seedDb = async()=>{
    await Campground.deleteMany({});
    for(let i=0; i<50; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author: '650858af24ba7f2078ce2f0b',
            location: `${cities[random1000].city} ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image:  `https://source.unsplash.com/random/640x480?camping,${i} `, //https://random.imagecdn.app/500/500
            price,
            description:`Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, noenim quae odio illum laudantium exercitationem. Harum sapiente, impedit esse odit ab, dolores nobis repellat ratione rerum vitae ut asperiores maxime?`,
            image:  [
                {
                  url: 'https://res.cloudinary.com/du43x2mnv/image/upload/v1698944708/YelpCamp/vansauzteyfkioufew4a.png',   
                  filename: 'YelpCamp/vansauzteyfkioufew4a',               
                },
                {
                  url: 'https://res.cloudinary.com/du43x2mnv/image/upload/v1698944709/YelpCamp/pd5is7pijcrwlld48au6.png',   
                  filename: 'YelpCamp/pd5is7pijcrwlld48au6',
                },
                {
                  url: 'https://res.cloudinary.com/du43x2mnv/image/upload/v1698944713/YelpCamp/wdgp2kjma0ki19wdewty.png',   
                  filename: 'YelpCamp/wdgp2kjma0ki19wdewty',
                }
              ]
        })
        await camp.save();
    }
}

seedDb().then(()=>{
    mongoose.connection.close();
})

