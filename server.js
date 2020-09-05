const express = require('express');
const axios = require('axios');
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.post('/processQuery', (req, res) => {

    axios({
        method: 'get',
        url: "https://www.googleapis.com/customsearch/v1?key=" + process.env.GOOGLE_API_KEY + "&cx=" + process.env.GOOGLE_CX + "&q=" + req.body.query
    }).then(async (rest) => {
        let TM = await getTM(req);
        let wiki = await getWiki(req);

        let data = {
            ...rest.data,
            ...TM.data._embedded,
            wiki:wiki
        }

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


}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

