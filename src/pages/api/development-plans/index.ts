import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import {
  authorizationValidationMiddleware,
  errorHandlerMiddleware,
  notificationHandlerMiddleware,
} from 'server/middlewares';
import { developmentPlanValidationSchema } from 'validationSchema/development-plans';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getDevelopmentPlans();
    case 'POST':
      return createDevelopmentPlan();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getDevelopmentPlans() {
    const data = await prisma.development_plan
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'development_plan'));
    return res.status(200).json(data);
  }

  async function createDevelopmentPlan() {
    await developmentPlanValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.development_plan.create({
      data: body,
    });
    await notificationHandlerMiddleware(req, data.id);
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
