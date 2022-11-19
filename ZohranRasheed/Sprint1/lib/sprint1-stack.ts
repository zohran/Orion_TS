import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Sprint1Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);


  const hw_lambda = this.createLambdaFunction('ZohranHWLambda', './resources', 'HWLambda.HW_Lambda');
    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'Sprint1Queue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
  
  createLambdaFunction(id_:any, path:any, handler_:any)
  {
    return new lambda.Function(this,"ZohranHWLambda",
    {
      runtime: lambda.Runtime.NODEJS_14_X, 
      code:lambda.Code.fromAsset(path),
      handler: handler_})
  }
}
