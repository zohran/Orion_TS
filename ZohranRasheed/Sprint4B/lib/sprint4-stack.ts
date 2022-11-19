import { Stack, StackProps, RemovalPolicy, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
const lambda = require("aws-cdk-lib/aws-lambda");
import * as apigateway from 'aws-cdk-lib/aws-apigateway'; 
import * as iam from 'aws-cdk-lib/aws-iam'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Sprint4Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const layer = new lambda.LayerVersion(this, 'ZohranLayer', {
      removalPolicy: RemovalPolicy.RETAIN,
      code: lambda.Code.fromAsset('layer')
    });

    const role = this.createRole('CloudWatchFullAccess');

    const backendLambda = this.createLambda('ZohranRasheed', './resources/backend_file', 'api_backend.handler', layer, role)
    backendLambda.applyRemovalPolicy(RemovalPolicy.DESTROY)

    const api = new apigateway.LambdaRestApi(this, 'API_Zohran', { handler: backendLambda }) 


  }


  /**
   * Create a Lambda
   * @param id the id of Function
   * @param handler the code to run
   * @param layer the layer that conatins asset
   * @param role the cloudwatch role
   * @returns the Lambda Function
   */
   createLambda(id:string, path:string, handler:string, layer:any, role:any) {
    return new lambda.Function(this, id, {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: handler,
      code: lambda.Code.fromAsset(path),
      layers: [layer],
      role,
      timeout: Duration.minutes(5)
    })
  }


   /**
   * Create cloudWatch role
   * @param policyName aws policy name
   * @returns the role
   */
    createRole(policyName: string) { 
      let lambda_role = new iam.Role(this, 'Role', 
      { assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'), 
        description: 'Cloud watch Role', 
      });
      lambda_role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName(policyName))
      return lambda_role; 
    }
}
