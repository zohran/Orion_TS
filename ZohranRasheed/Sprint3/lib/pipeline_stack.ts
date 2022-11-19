import * as cdk from 'aws-cdk-lib';
import { SecretValue, Stack, StackProps} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodeBuildStep, CodePipeline, ShellStep,CodePipelineSource, ManualApprovalStep } from "aws-cdk-lib/pipelines";
import { ZorhanSprint3Stage } from './pipeline_stage';

import {GitHubTrigger} from 'aws-cdk-lib/aws-codepipeline-actions';
export class Zohranpipeline extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Pipeline code goes here
        const source = CodePipelineSource.gitHub('Zohran2022skipq/Orion_TS', 'main', {
            authentication: cdk.SecretValue.secretsManager('ZohranSecretKey'),
            trigger: GitHubTrigger.POLL,
        });

        // Decalring synth for pipeline
         const synth = new ShellStep('Synth_', {
            // where the source can be found
            input: source,
            // Install dependencies, build, and run cdk synth
            commands: [
                'cd ZorhanRasheed/Sprint3',
                'npm ci',
                'npm run build',
                'npx cdk synth',
            ],
            // where the output will 
            primaryOutputDirectory: 'ZohranRasheed/Sprint3/cdk.out',
        })
        
        //Declaring Pipeline

        const Zohran_pipeline= new CodePipeline(this,"Pipeline_",
        {
            pipelineName:"ZohranPipeline",
            synth: synth,
        })

        
        

        //Declaring Unit Test
        const test = new ShellStep('UnitTest', {
            commands: [
                'cd ZohranRasheed/Sprint3',
                'npm ci',
                'npm run test',
            ]
        })

        // //Beta Stage
        // const betaStage=new ZorhanSprint3Stage(this,"betaStage",{
        //     env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
        // })

        // //Production Stage
        // const productionStage=new ZorhanSprint3Stage(this,"prodStage",{
        //     env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
        // })

        // //Adding Stages to pipeline

        // Zohran_pipeline.addStage(betaStage,{
        //     pre:[test,]
        // })
        // Zohran_pipeline.addStage(productionStage,{
        //     pre:[new ManualApprovalStep("Approve to proceed")],
        // })
    }
}  