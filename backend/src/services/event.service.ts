import prisma from '../prisma';

interface CreateEventInput {
  userId: string;
  type: string;
  metadata?: string;
}

export const createEvent = async ({ userId, type, metadata }: CreateEventInput) => {
  return prisma.event.create({
    data: {
      userId,
      type,
      metadata,
    },
  });
};