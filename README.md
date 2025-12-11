This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

Infrastructure (AWS CloudFormation)

An AWS CloudFormation template is provided to provision the AWS resources needed to run this app on ECS Fargate and to host its Docker image on ECR.

- Template path: infra/cloudformation/ecr-ecs-fargate.yml

What it creates:
- ECR repository (with scan on push and simple lifecycle policy)
- ECS Cluster
- IAM roles (task execution role and task role)
- CloudWatch Logs log group
- Security group to allow ingress to the app port
- Fargate Task Definition (awsvpc, configurable CPU/memory)
- ECS Service (Fargate) in your provided subnets

Required parameters when deploying:
- RepositoryName: ECR repository name to create/use
- VpcId: Your VPC ID
- SubnetIds: Comma-separated subnet IDs (use public subnets if AssignPublicIp=ENABLED)

Common optional parameters:
- ClusterName (default: app-cluster)
- ServiceName (default: app-service)
- AppPort (default: 3000)
- DesiredCount (default: 1)
- Cpu (default: 512), Memory (default: 1024)
- ImageTag (default: latest)
- AssignPublicIp (ENABLED|DISABLED, default: ENABLED)

Example deploy command:

```bash
STACK_NAME=buy-or-sell-ecs
REGION=us-east-1

aws cloudformation deploy \
  --region "$REGION" \
  --stack-name "$STACK_NAME" \
  --template-file infra/cloudformation/ecr-ecs-fargate.yml \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
    RepositoryName=buy-or-sell-client \
    ClusterName=buy-or-sell-cluster \
    ServiceName=buy-or-sell-client-svc \
    VpcId=vpc-0123456789abcdef0 \
    SubnetIds=subnet-aaa111bbb222,subnet-ccc333ddd444 \
    AssignPublicIp=ENABLED \
    AppPort=3000 \
    DesiredCount=1 \
    Cpu=512 \
    Memory=1024
```

After the stack is created:
- Push your Docker image to the created ECR repository. The included GitHub Actions workflow (.github/workflows/ecr-ecs-deploy.yml) already builds and pushes images tagged with latest and the commit SHA.
- The ECS service uses the ImageTag parameter (default latest). Ensure your task definition image tag matches what you push or update the stack with a different ImageTag to roll out.
