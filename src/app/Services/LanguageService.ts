import LanguageRepository from '../Repositories/LanguageRepository';

/**
 * Fetch all Role Data
 * @param reqQuery
 *
 * @returns Collection
 */
const fetchAllLanguages = () => {
  return LanguageRepository.fetchAllLanguages();
};

export default {
  fetchAllLanguages,
};
