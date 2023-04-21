import { Prisma, PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';
import { fetchQueryParamsType } from '../../types/commons';

const prisma = new PrismaClient();

/**
 * Fetch All Companies
 * @param queryParams
 * @returns
 */
const fetchAllCompanies = async (queryParams: fetchQueryParamsType) => {
  try {
    const { pageNumber, pageSize, sort_field, sort_order } = queryParams;
    const result = await prisma.company.findMany({
      skip: Number((pageNumber - 1) * pageSize),
      take: Number(pageSize),
      orderBy: {
        [sort_field]: sort_order,
      },
    });

    const count = await prisma.company.count({});

    return {
      page: pageNumber,
      size: pageSize,
      total_records: count,
      total_page: Math.ceil(count / pageSize),
      data: result,
    };
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

/**
 * Fetch All Companies Data from dropdown
 * @param queryParams
 * @returns
 */
const fetchAllCompaniesDataForDropdown = async () => {
  try {
    const result = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return result;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

/**
 * Fetch Data By id
 * @param id
 * @returns User
 */
const findById = async (id: string) => {
  try {
    const result = await prisma.company.findFirst({
      where: {
        id: Number(id),
      },
    });

    return result;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

/**
 * Store Company in DB
 * @param userData
 * @returns
 */
const storeCompany = async (companyData: Prisma.companyCreateInput) => {
  try {
    const savedCompany = await prisma.company.create({
      data: companyData,
    });

    return savedCompany;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

/**
 * Update Company in Db
 * @param id string
 * @param data object
 * @returns
 */
const updateCompany = async (id: string, data: any) => {
  try {
    const [result] = await prisma.$transaction([
      prisma.company.update({
        where: {
          id: Number(id),
        },
        data,
      }),
    ]);

    return result;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

/**
 * Delete Company in DB
 *
 * @param companyId string
 * @param loggedInUser string
 * @returns
 */
const deleteCompany = async (companyId: string) => {
  try {
    const deleteResult = await prisma.company.delete({
      where: {
        id: Number(companyId),
      },
    });

    return deleteResult;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};
export default {
  fetchAllCompanies,
  fetchAllCompaniesDataForDropdown,
  findById,
  storeCompany,
  updateCompany,
  deleteCompany,
};
