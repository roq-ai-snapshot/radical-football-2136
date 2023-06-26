import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware, notificationHandlerMiddleware } from 'server/middlewares';
import { developmentPlanValidationSchema } from 'validationSchema/development-plans';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.development_plan
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getDevelopmentPlanById();
    case 'PUT':
      return updateDevelopmentPlanById();
    case 'DELETE':
      return deleteDevelopmentPlanById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getDevelopmentPlanById() {
    const data = await prisma.development_plan.findFirst(convertQueryToPrismaUtil(req.query, 'development_plan'));
    return res.status(200).json(data);
  }

  async function updateDevelopmentPlanById() {
    await developmentPlanValidationSchema.validate(req.body);
    const data = await prisma.development_plan.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    await notificationHandlerMiddleware(req, data.id);
    return res.status(200).json(data);
  }
  async function deleteDevelopmentPlanById() {
    await notificationHandlerMiddleware(req, req.query.id as string);
    const data = await prisma.development_plan.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
