const express = require('express');
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
// app.use(limiter); // rate limiter


const port = process.env.PORT || 6000;

app.listen(port, () => console.log(`Server running on port ${port}`));
