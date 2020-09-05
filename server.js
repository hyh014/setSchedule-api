const express = require('express');
const axios = require('axios');
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();
// const rateLimit = require('express-rate-limit');
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 150, // limit each IP to 150 requests per windowMs
//     statusCode: 200,
//     message: {
//         status: 429,
//         error: 'You are making too many requests. Please try again in 20 minutes.'
//     }
// });

const app = express();
app.use(express.json());
app.use(cors());
// app.use(limiter); // rate limiter
app.post('/processQuery', (req, res) => {

    axios({
        method: 'get',
        url: "https://www.googleapis.com/customsearch/v1?key=" + process.env.GOOGLE_API_KEY + "&cx=" + process.env.GOOGLE_CX + "&q=" + req.body.query
    }).then(async (rest) => {
        let TM = await getTM(req);
        let wiki = await getWiki(req);
        console.log(wiki);
        let data = {
            ...rest.data,
            ...TM.data._embedded,
            wiki:wiki
        }
        // console.log(all.data._embedded);
        res.status(200).send(data);
    }).catch(err => {
        console.log(err);
    })
})
function getTM(query) {
    let promise = new Promise(async (resolve, reject) => {
        let ticket = await getTicketMaster(query.body);
        resolve(ticket);

    })

    return promise;
}
function getWiki(query) {
    let promise = new Promise(async (resolve, reject) => {
        let wiki = await getWikipedia(query.body);
        resolve(wiki);

    })
    return promise;
}
async function getTicketMaster(query) {
    return await axios({
        method: 'get',
        url: `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${query.query}&postalcode=${query.zip}&radius=${query.radius}&apikey=${process.env.TICKETMASTER_API_KEY}`
    }).then((rest) => {

        return rest;
    }).catch(err => {
        return err;
    })

}
function getWikipedia(query) {

    return axios({
        method: 'get',
        url: `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${query.query}`
    }).then((rest) => {
        return rest.data.query.pages;
    }).catch(err => {
        return err;
    })
    //   url:'http://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=pizza&limit=1&namespace=0'
    //   url:'https://en.wikipedia.org/w/api.php?origin=*&action=parse&format=json&page=house&prop=wikitext&section=0&disabletoc=1'

}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

