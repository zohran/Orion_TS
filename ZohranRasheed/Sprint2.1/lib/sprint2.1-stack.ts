import { RemovalPolicy, Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events'
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as targets from 'aws-cdk-lib/aws-events-targets'
import * as iam from 'aws-cdk-lib/aws-iam';
import * as constants from '../resources/Constants';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as cw_actions from 'aws-cdk-lib/aws-cloudwatch-actions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3Deployment from 'aws-cdk-lib/aws-s3-deployment';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sns_subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';

export class ZohranSprint2Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // store the constancts on S3 bucket
    // const constantBucket = this.createBucket()
    // // Deploy the constants to S3 bucket
    // new s3Deployment.BucketDeployment(this, 'DeployConstants', {
    //   destinationBucket: constantBucket,
    //   sources: [s3Deployment.Source.asset('./resources/constants/')],
    // })

    // iam role
    const role = this.createRole()

    // layers for the lambda
    const layer = this.createLayer()

    // The code that defines your stack goes here
    const wh_lambda = this.createLambda('Zohran_wh_lambda', './resources', 'WH_lambda.handler', layer, role,);

    // Grant permission to the lambda function to read the bucket
    // constantBucket.grantRead(wh_lambda);

    // Create Topic
    const topic = new sns.Topic(this, 'Zorhan_Sprint2_Topic');

    // Create Subscription
    topic.addSubscription(new sns_subscriptions.EmailSubscription(constants.EMAIL_TO_SEND));

    // setting up alarms and metric
    for (let i = 0; i < constants.URL_TO_CHECK.length; i++) {
      // Latency Alarm
      let metric = this.return_Metrics('URL_LATENCY', constants.URL_TO_CHECK[i])
      let latencyAlarmID = "Zohran_Sprint2_Latency_Alarm_" + constants.URL_TO_CHECK[i]
      let latencyAlarm = this.createAlarm(latencyAlarmID, cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
        constants.LATENCY_THRESHOLD, constants.EVALUATION_PERIOD, metric);

      // Availability Alarm
      let availMetric = this.return_Metrics('URL_AVAILABILITY', constants.URL_TO_CHECK[i])
      let availAlarmID = "Zohran_Sprint2_Availability_Alarm_" + constants.URL_TO_CHECK[i]
      let availAlarm = this.createAlarm(availAlarmID, cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
        constants.AVAILABILITY_THRESHOLD, constants.EVALUATION_PERIOD, availMetric);

      // add action to alarm
      latencyAlarm.addAlarmAction(new cw_actions.SnsAction(topic));
      availAlarm.addAlarmAction(new cw_actions.SnsAction(topic));
    }

    /*
    * Schedule for the lambda function 
    * The lambda function will be triggered every minute
    * Logs will be written to the cloudwatch logs every minute
    * To see the Rule in the console, you need to go to the EventBridge console
    */
    const rule = this.createRule(wh_lambda);
  }

  // create a bucket
  createBucket() {
    return new s3.Bucket(this, 'ZohrantSprint2', {
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY,
      publicReadAccess: true,
      autoDeleteObjects: true,
    })
  }

  // Creating layer for the lambda
  createLayer() {
    return new lambda.LayerVersion(this, 'ZohranLayer', {
      code: lambda.Code.fromAsset('./layer'),
      description: 'Zorhan,s Layer',
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }

  // Creating role for the lambda
  createRole() {
    return new iam.Role(this, 'Sprint2Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        // iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchFullAccess'),
      ]
    });
  }

  /*
    * Schedule for the lambda function 
    * The lambda function will be triggered every minute
    * Logs will be written to the cloudwatch logs every minute
    * To see the Rule in the console, you need to go to the EventBridge console
    */
  createRule(lambda_name: any) {
    return new Rule(this, 'ZorhanRole_', {
      schedule: Schedule.rate(Duration.minutes(1)),
      targets: [new targets.LambdaFunction(lambda_name)]
    });
  }

  /**
   * Create a Metric for the given url
   * @param metric_type the type of the metric
   * @param url the url to check
   * @returns the metric
   */
  return_Metrics(metric_type: string, url: string) {
    let metricName = metric_type
    let dimension = { "URL": url }
    return new cloudwatch.Metric({
      metricName: metricName,
      namespace: constants.NAMESPACE,
      period: Duration.minutes(1),
      dimensionsMap: dimension,
    })
  }

  /**
   * Create an alarm for the given url
   * @param id the id of the alarm
   * @param comparison_type the operator of the alarm
   * @param threshold the threshold of the alarm
   * @param evaluationPeriods the evaluation period of the alarm
   * @param metric the metric of the alarm
   */
  createAlarm(id: string, comparison_type: cloudwatch.ComparisonOperator, threshold: number,
    evaluationPeriods: number, metric: cloudwatch.IMetric) {
    return new cloudwatch.Alarm(this, id, {
      metric: metric,
      threshold: threshold,
      evaluationPeriods: evaluationPeriods,
      comparisonOperator: comparison_type,
      actionsEnabled: true,
      alarmDescription: 'Alarm when latency is greater than 200 ms',
    })
  }

  /**
   * Create a lambda function with the given name, handler and code
   * @param id the name of the lambda function
   * @param path the path to the code
   * @param handler the handler of the lambda function
   * @param layer the layers of the lambda function
   * @returns the lambda function
   */
  createLambda(id: string, path: string, handler: string, layer: any, role: any,) {
    return new lambda.Function(this, id, {
      code: lambda.Code.fromAsset(path),
      handler: handler,
      runtime: lambda.Runtime.NODEJS_12_X,
      layers: [layer],
      role: role,
      timeout: Duration.minutes(10),
    
    });
  }
}