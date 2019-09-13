const express = require('express');
const app = express();
const request = require('request');
const YAML = require('yaml');
const fs = require('fs');

const file = fs.readFileSync('./config/config.yaml', 'utf8');
const yaml_config = YAML.parse(file);

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.post('/webhook-jenkins/:token', (req, res) => {
    let url = yaml_config['base_url'] + req.params.token;
    if (req.body.object_attributes.state == "merged") {
        request.post(url, { json: req.body }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                res.status(response.statusCode).send(body);
            } else {
                res.status(response.statusCode).send(error);
            }
        });
    } else {
        res.status(200).send({ "result": "operacion no es un merged" });
    }
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})