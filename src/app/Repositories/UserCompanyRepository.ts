import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const storeUserCompanyMappingData = async (userCompanyData: any, savedUser: any, prismaTx: any = prisma) => {
  const deleteResult = prismaTx.users_company.deleteMany({
    where: {
      user_id: parseInt(savedUser.id),
    },
  });

  const userCompanyResult = prismaTx.users_company.createMany({
    data: userCompanyData,
  });

  return { deleteResult, userCompanyResult };
};

export default { storeUserCompanyMappingData };
