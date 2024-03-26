import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';
import { BlockPublicAccess, BucketAccessControl } from 'aws-cdk-lib/aws-s3';


export class S3CloudfrontStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);

      const bucket = new s3.Bucket(this, 'pflitzer-bucket', {
        publicReadAccess: true,
        blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
        accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
      });

      const ResponseHeadersPolicy = new cloudfront.ResponseHeadersPolicy(
        this,
        'SecurityHeadersResponseHeaderPolicy',
        {
            securityHeadersBehavior: {
                strictTransportSecurity: {
                    override: true,
                    accessControlMaxAge: cdk.Duration.days(2 * 365),
                    includeSubdomains: true,
                    preload: true,
                },
                contentTypeOptions: {
                    override: true,
                },
                referrerPolicy: {
                    override: true,
                    referrerPolicy: cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
                },
                xssProtection: {
                    override: true,
                    protection: true,
                    modeBlock: true,
                },
                frameOptions: {
                    override: true,
                    frameOption: cloudfront.HeadersFrameOption.DENY,
                },
            },
        }
      );

      const cloudfrontOAI = new cloudfront.OriginAccessIdentity(
        this,
        'CloudFrontOriginAccessIdentity'
      );

      const distribution = new cloudfront.Distribution(this, 'distribution', {
        defaultRootObject: "index.html",
        defaultBehavior: {
            origin: new S3Origin(bucket , { originAccessIdentity: cloudfrontOAI}),
            
            viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            responseHeadersPolicy: ResponseHeadersPolicy,
        },
        errorResponses: [
            {
            httpStatus: 404,
            responsePagePath: "/",
            },
            {
            httpStatus: 403,
            responsePagePath: "/",
            }
        ],
      });
    }
}