'use strict';

const axios = require('axios');
const chalk = require('chalk');
const fetch = require('node-fetch');
const fs = require('fs');


//please get credentials from EagleEye
const credentials = {
    username: '',  
    password: ''   
};

const credentialToken = {
    token: ''
};

let credentialAuth_key = '';


const shuffle = (array) => {
    let copy = [],
        n = 20,
        i;
    // While there remain elements to shuffle…
    while (n) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * n--);

        // And move it to the new array.
        copy.push(array.splice(i, 1)[0]);
    }
    return copy;
}


const getImages = async() => {

    try {
        const resp = await axios.post('https://login.eagleeyenetworks.com/g/aaa/authenticate', credentials);
        console.log(chalk.green('\nAuthentication complete.'));
        credentialToken.token = resp.data.token;
        try {
            const resp = await axios.post('https://login.eagleeyenetworks.com/g/aaa/authorize', credentialToken);
            console.log(chalk.green('Authorize complete.'));

            const cookieValue = resp.headers['set-cookie'][1].split('; ');
            console.log(chalk.green(cookieValue[0]));
            credentialAuth_key = cookieValue[0];

            console.log(chalk.blue('\nHi! ' + resp.data.first_name + " " + resp.data.last_name));
            console.log(chalk.blue('Your user_ID: ' + resp.data.user_id));

            try {
                const resp = await axios.get('https://login.eagleeyenetworks.com/g/device/list', {
                    headers: {
                        'Cookie': credentialAuth_key
                    }
                });
                console.log(chalk.yellow('\nAll camera devices: ' + resp.data.length));
                const selected20Items = shuffle(resp.data);
                console.log(chalk.yellow('\nSelected random 20 camera IDs completed. '));
                const temps = selected20Items.map(async(item) => {
                    // display 20 random item from cams list
                    // console.log(chalk.yellow(item[1]));
                    const gg = {
                        headers: {
                            'Cookie': credentialAuth_key,
                            'content-type': 'image/jpeg'
                        }
                    }
                    try {
                        const response = await fetch('https://login.eagleeyenetworks.com/asset/next/image.jpeg' + '?id=' + item[1] + '&timestamp=now&asset_class=all', gg);
                        const buffer = await response.buffer();
                        //write image on disk. Folder 'images' is required!
                        fs.writeFile(`../images/imageFrom_` + item[1] + `.jpg`, buffer, () =>

                            console.log(chalk.blue('Fetching JPG data from cam ID: ' + item[1] + ' completed.')))

                    } catch (error) {
                        console.error(chalk.red(error));
                    }
                });

            } catch (error) {
                console.error(chalk.red(error));
            }

        } catch (error) {
            console.error(chalk.red(error));
        }

    } catch (error) {
        console.error(chalk.red(error));
    }
}


module.exports = async() => {
    try {
        getImages()

    } catch (error) {
        console.error(chalk.red(error));
    }
};