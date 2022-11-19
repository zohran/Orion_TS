const axios = require("axios")
import { CloudWatchMetrics } from './WH_cloudwatch';
import {URL_TO_CHECK} from "./Constants"
import * as C from "./Constants"
var aws = require('aws-sdk');


/**
 * // Web Health Check Lambda Handler 
 */
exports.handler = async function (event: any) {

    let cw = new CloudWatchMetrics()

    // Get the C from S3
    // let C = await getConstants()

    /**
    * Return the availability and latency of each url.
    * The return value is a JSON object,
    * The JSON object contains the availability and latency of each url
    */
    let urls: any[] = URL_TO_CHECK
    let result: any = {};
    for (let i = 0; i < urls.length; i++) {

        // Store the availability and latency of each url
        let latency: any = await getLatency(urls[i])
        let availability: any = await getAvailability(urls[i])

        cw.PublishData(C["NAMESPACE"], C["METRIC_NAME_AVAILABLILTY"], urls[i], availability)
        cw.PublishData(C["NAMESPACE"], C["METRIC_NAME_LATENCY"], urls[i], latency)

        // Store the availability and latency of each url
        result[urls[i]] = {
            "Latency": latency,
            "Availability": availability
        }
    }

    // return s3_Object.C
    return C
}


/** 
 * @param url: string
 * @returns the latency of the url
 */
async function getLatency(url: string) {
    
    // Check the latency of each URl In miliseconds
    let start = new Date().getTime()
    let lat = await axios.get(url)
    let end = new Date().getTime()
    let delta = end - start

    return delta
}


/**
 * @param url : string
 * @returns the availability of the url
 */
async function getAvailability(url: string) {

    // Check the availability of each URL
    let status = await axios.get(url);
    if (status.status == 200) { // if the status is 200, the url is available
        return 1
    } else { // if the status is not 200, the url is unavailable
        return 0
    }
}

async function getConstants() {

    let s3 = new aws.S3();
    let response: any

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: process.env.Key
    };

    // Download the file from S3
    await s3.getObject(params, function (error: any, data: any) {
        // check for error
        if (error) {
            console.log(error, error.stack); // an error occurred
        }
        else {
            // stringify the data
            let json = JSON.parse(data.Body.toString('utf-8'));
            response = json
        }
    }).promise()

    return response
}