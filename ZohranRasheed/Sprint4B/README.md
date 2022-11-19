
# Sprint 4

This repository contains lambda function of web urls on which we perform CRUD operations using NodeJs and can test it using API Gateway on AWS. This repository contains functionality of CICD (pipeline) and Alarms on each URL present in the database of application.

## Useful Commands

To deploy this project run command below

```bash
  npm run watch
  cdk synth
  cdk build
```


## Installation

Install project-name with npm

```bash
  npm install project-name
  cd my-project
```
    
## Appendix

This project was created by following steps:

    1. Initialized cdk app 
    2. Written code for handler in api_backend
    3. Written code for CRUD Operations in resource folder
    4. Written code for middleware to not allow anything else other than url to be inserted
    5. Written code for uploading data on mongodb atlas
    6. Finally, Synth and deploy 

## 🚀 About Me
I'm a full stack developer and now working as Skipq trainee.


## Documentation
AWS Documentation:
[Documentation](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda.Function.html)


