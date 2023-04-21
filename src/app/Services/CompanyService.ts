import { Prisma } from '@prisma/client';
import { fetchQueryParamsType } from '../../types/commons';
import CompanyRepository from '../Repositories/CompanyRepository';

/**
 * Fetch all Company Data
 * @param reqQuery
 *
 * @returns Collection
 */
const fetchAllCompanies = (reqQuery: fetchQueryParamsType) => {
  return CompanyRepository.fetchAllCompanies(reqQuery);
};

/**
 * fetch Company by id
 * @returns
 */
const findById = (id: string) => {
  return CompanyRepository.findById(id);
};

/**
 * Store Company in DB
 * @param data
 * @returns
 */
const storeCompany = async (data: Prisma.companyCreateInput) => {
  return CompanyRepository.storeCompany(data);
};

/**
 * Update Company Data in DB
 * @param data
 * @returns
 */
const updateCompany = async (id: string, data: object) => {
  return CompanyRepository.updateCompany(id, data);
};

/**
 * Delete Company in DB
 * @param userId string
 * @returns
 */
const deleteCompany = (userId: string) => {
  return CompanyRepository.deleteCompany(userId);
};

/**
 * Fetch all Company Data
 * @param reqQuery
 *
 * @returns Collection
 */
const fetchAllCompaniesDataForDropdown = () => {
  return CompanyRepository.fetchAllCompaniesDataForDropdown();
};

export default {
  fetchAllCompanies,
  findById,
  storeCompany,
  updateCompany,
  deleteCompany,
  fetchAllCompaniesDataForDropdown,
};
