import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const addUserBankDetails = async (userData: any, bankDetailsData: any) => {
  const result = await prisma.$transaction([
    prisma.user_bank_details.deleteMany({
      where: {
        user_id: userData.id,
      },
    }),
    prisma.user_bank_details.createMany({
      data: bankDetailsData,
    }),
  ]);

  return result;
};

export default { addUserBankDetails };
