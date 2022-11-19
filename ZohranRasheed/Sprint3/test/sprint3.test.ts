import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as Sprint3 from '../lib/sprint3-stack';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/sprint3-stack.ts
test("Lambda Function Creation", () => {
    const app = new cdk.App();
      // WHEN
    const stack = new Sprint3.Sprint3Stack(app, 'MyTestStack');
      // THEN
    const template = Template.fromStack(stack);
      // count the number of lambda functions
    
    template.resourceCountIs('AWS::Lambda::Function', 3);
  });



  test("S3 Bucket Creation", () => {
    const app = new cdk.App();
      // WHEN
    const stack = new Sprint3.Sprint3Stack(app, 'MyTestStack');
      // THEN
    const template = Template.fromStack(stack);
      // count the number of S3 buckets
    
    template.resourceCountIs('AWS::S3::Bucket', 1);
  });
