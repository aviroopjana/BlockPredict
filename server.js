const express = require('express')
const axios = require('axios')
const { ethers } = require('ethers')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
require('dotenv').config()

const app = express()

const apiKey = process.env.API_KEY;

class Block{
    constructor(timeStamp,blockReward) {
        this.timeStamp = timeStamp;
        this.blockReward = blockReward;
    }
}

const fetchData = async() => {
    try{
        let listOfBlocks = [];

        for(let blockNumber = 17460527; blockNumber<17460827;blockNumber++) {
            const apiUrl = `https://api.etherscan.io/api?module=block&action=getblockreward&blockno=${blockNumber}&apikey=${apiKey}`;
            const response = await axios.get(apiUrl);
            const rewardEther = ethers.utils.formatEther(response.data.result.blockReward);
            const timeStamp = response.data.result.timeStamp;
            const block = new Block(timeStamp, rewardEther); 
            listOfBlocks.push(block);  
        }
        exportToCsv(listOfBlocks);
    } catch (error) {
        console.error(error);
    }
}

const exportToCsv = (data) => {
    const csvWriter = createCsvWriter({
        path: 'block_data.csv',
        header: [
            {id: 'timeStamp', title: 'timeStamp'},
            {id: 'blockReward', title: 'blockReward'}
        ]
    });

    csvWriter.writeRecords(data).then(()=> {
        console.log("CSV file created successfully!");
    })
    .catch((error) => {
        console.error(error);
    });
};

fetchData();

app.listen(8080,()=>{
    console.log("Server is Running");
})