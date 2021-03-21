// module imports
// require('dotenv').config() blir gjort i package.json, under "scripts:" "dev"
const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const fetch = require('node-fetch');
const path = require('path')

// sette view engine til handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// getMedia()
// get request mot endpoint
// async function getMedia() {
//   const media = await fetch(`https://graph.instagram.com/me/media?fields=id,media_url,caption&access_token=${process.env.ACCESS_TOKEN}`)
//     .then(res => res.json())
//   // console.log(media)
//   return media
// }
fetch(`https://graph.instagram.com/me/media?fields=id,media_url,media_type,caption&access_token=${process.env.ACCESS_TOKEN}`)
  .then(res => res.json())
  .then(res => {
    const dataResult = res.data
    var dataResultImages = []

    for (let i = 0; i < dataResult.length; i++) {
      const element = dataResult[i]
      if (element.media_type == 'IMAGE' || element.media_type == 'CAROUSEL_ALBUM') {
        dataResult.splice(i, element)
        // console.log(element.media_type)
        dataResultImages.push(element)
      }
    }

    // console.log(dataResultImages);

    // log første resultat
    // console.log(dataResult[0])

    // homepage route
    app.get('/', (req, res) => res.render('index', {
      media: dataResultImages
    }))
  })

// app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static('public'));

const PORT = process.env.PORT || 5000 // when deployed, it will use its own process env variable

app.listen(PORT, () => console.log(`server started on ${PORT}`))