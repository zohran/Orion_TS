var AWS = require('aws-sdk');

export class CloudWatchMetrics {

  PublishData(name_space: string, MetricName: string, url: string, metric_value: number) {

    // Create a CloudWatch Object
    var cw = new AWS.CloudWatch();

    // Create parameters JSON for putMetricData
    var params = {
      MetricData: [ /* required */
        {
          MetricName: MetricName, /* required */
          Dimensions: [
            {
              Name: 'URL', /* required */
              Value: url /* required */
            },
            /* more items */
          ],
          Value: metric_value,
        },
      ],
      Namespace: name_space /* required */
    };

    /**
     * Put metric data to CloudWatch
     * @param params JSON object for putMetricData
     * @returns {Promise<any>}
     */
    cw.putMetricData(params, function (err: any, data: any) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log("Success " + data); // successful response  )
    });
  }
}