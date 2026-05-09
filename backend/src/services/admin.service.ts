import prisma from '../prisma';

export const getUsersForAdmin = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      riskScore: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getEventsForAdmin = async () => {
  return prisma.event.findMany({
    select: {
      id: true,
      type: true,
      metadata: true,
      timestamp: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          riskScore: true,
        },
      },
    },
    orderBy: {
      timestamp: 'desc',
    },
  });
};

export const getSecurityStats = async () => {
  const totalUsers = await prisma.user.count();

  const highRiskUsers = await prisma.user.count({
    where: {
      riskScore: {
        gte: 70,
      },
    },
  });

  const totalEvents = await prisma.event.count();

  const blockedActions = await prisma.event.count({
    where: {
      type: {
        in: ['cart_add_blocked', 'login_blocked'],
      },
    },
  });

  return {
    totalUsers,
    highRiskUsers,
    totalEvents,
    blockedActions,
  };
};

export const getUserDetailsForAdmin = async (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      riskScore: true,
      createdAt: true,
      updatedAt: true,
      events: {
        select: {
          id: true,
          type: true,
          metadata: true,
          timestamp: true,
        },
        orderBy: {
          timestamp: 'desc',
        },
      },
    },
  });
};