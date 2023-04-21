import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const storeUserCompanyMappingData = async (userCompanyData: any, savedUser: any) => {
  const result = await prisma.$transaction([
    prisma.users_company.deleteMany({
      where: {
        user_id: savedUser.id,
      },
    }),
    prisma.users_company.createMany({
      data: userCompanyData,
    }),
  ]);

  return result;
};

export default { storeUserCompanyMappingData };
