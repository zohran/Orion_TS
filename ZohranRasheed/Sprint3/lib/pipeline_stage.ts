import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Sprint3Stack } from "./sprint3-stack";

export class ZorhanSprint3Stage extends Stage {
    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);

        // stage
        const stage = new Sprint3Stack(this, 'ZohranSprint3Stack')

    }
}