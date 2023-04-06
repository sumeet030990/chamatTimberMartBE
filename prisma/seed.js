const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // companies
  await prisma.company.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Chamat Timber Mart',
      allow_billing: true,
      allow_gst_billing: false,
      primary_contact: '9595109394',
      gst_no: '11111111',
      gst_tax_percentage: 18,
      address: 'Queta Colony',
      country_id: 101,
      country_name: 'India',
      state_id: 4008,
      state_name: 'Maharashtra',
      city_id: 133116,
      city_name: 'Nagpur',
      pin_code: 440008,
    },
  });

  await prisma.company.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Chamat Furniture Factory',
      allow_billing: false,
      allow_gst_billing: true,
      primary_contact: '9595109394',
      gst_no: '22222222',
      gst_tax_percentage: 18,
      address: 'Queta Colony',
      country_id: 101,
      country_name: 'India',
      state_id: 4008,
      state_name: 'Maharashtra',
      city_id: 133116,
      city_name: 'Nagpur',
      pin_code: 440008,
    },
  });

  // roles
  await prisma.roles.upsert({
    where: { slug: 'admin' },
    update: {},
    create: {
      name: 'Admin',
      slug: 'admin',
    },
  });

  await prisma.roles.upsert({
    where: { slug: 'customer_user' },
    update: {},
    create: {
      name: 'Customer User',
      slug: 'customer_user',
    },
  });

  await prisma.roles.upsert({
    where: { slug: 'customer_company' },
    update: {},
    create: {
      name: 'Customer Company',
      slug: 'customer_company',
    },
  });

  await prisma.roles.upsert({
    where: { slug: 'employee_operator' },
    update: {},
    create: {
      name: 'Employee Operator',
      slug: 'employee_operator',
    },
  });

  await prisma.roles.upsert({
    where: { slug: 'employee_normal' },
    update: {},
    create: {
      name: 'Employee Normal',
      slug: 'employee_normal',
    },
  });

  // Language
  await prisma.languages.upsert({
    where: { code: 'en' },
    update: {},
    create: {
      name: 'English',
      code: 'en',
    },
  });

  await prisma.languages.upsert({
    where: { code: 'hi' },
    update: {},
    create: {
      name: 'Hindi',
      code: 'hi',
    },
  });

  await prisma.languages.upsert({
    where: { code: 'mr' },
    update: {},
    create: {
      name: 'Marathi',
      code: 'mr',
    },
  });

  // users
  await prisma.users.upsert({
    where: { user_name: 'sumeet' },
    update: {},
    create: {
      name: 'sumeet',
      allow_login: true,
      user_name: 'sumeet',
      password: '$2b$10$AxMw./hiWRdCg/OuFG9xUeWGV2GMWFVCKchr1Kslbk.l4dwpCnglm',
      user_role_id: 1,
      language_id: 1,
      primary_contact: '8408880505',
      country_id: 101,
      country_name: 'India',
      state_id: 4008,
      state_name: 'Maharashtra',
      city_id: 133116,
      city_name: 'Nagpur',
      pin_code: '440008',
      created_by: 1,
    },
  });

  await prisma.users.upsert({
    where: { user_name: 'pratiek' },
    update: {},
    create: {
      name: 'pratiek',
      allow_login: true,
      user_name: 'pratiek',
      password: '$2b$10$AxMw./hiWRdCg/OuFG9xUeWGV2GMWFVCKchr1Kslbk.l4dwpCnglm',
      user_role_id: 1,
      language_id: 1,
      primary_contact: '9595109394',
      country_id: 101,
      country_name: 'India',
      state_id: 4008,
      state_name: 'Maharashtra',
      city_id: 133116,
      city_name: 'Nagpur',
      pin_code: '440008',
      created_by: 1,
    },
  });

  await prisma.users.upsert({
    where: { user_name: 'customer_company' },
    update: {},
    create: {
      name: 'Customer Company',
      allow_login: true,
      user_name: 'customer_company',
      password: '$2b$10$AxMw./hiWRdCg/OuFG9xUeWGV2GMWFVCKchr1Kslbk.l4dwpCnglm',
      user_role_id: 3,
      language_id: 1,
      primary_contact: '0123456789',
      country_id: 101,
      country_name: 'India',
      state_id: 4008,
      state_name: 'Maharashtra',
      city_id: 133116,
      city_name: 'Nagpur',
      pin_code: '440008',
      created_by: 1,
    },
  });

  await prisma.users.upsert({
    where: { user_name: 'employee_operator' },
    update: {},
    create: {
      name: 'Employee Operator',
      allow_login: true,
      user_name: 'employee_operator',
      password: '$2b$10$AxMw./hiWRdCg/OuFG9xUeWGV2GMWFVCKchr1Kslbk.l4dwpCnglm',
      user_role_id: 4,
      language_id: 1,
      primary_contact: '0123456789',
      country_id: 101,
      country_name: 'India',
      state_id: 4008,
      state_name: 'Maharashtra',
      city_id: 133116,
      city_name: 'Nagpur',
      pin_code: '440008',
      created_by: 1,
    },
  });

  await prisma.users.upsert({
    where: { user_name: 'employee_normal' },
    update: {},
    create: {
      name: 'Employee Normal',
      allow_login: true,
      user_name: 'employee_normal',
      password: '$2b$10$AxMw./hiWRdCg/OuFG9xUeWGV2GMWFVCKchr1Kslbk.l4dwpCnglm',
      user_role_id: 5,
      language_id: 1,
      primary_contact: '0123456789',
      country_id: 101,
      country_name: 'India',
      state_id: 4008,
      state_name: 'Maharashtra',
      city_id: 133116,
      city_name: 'Nagpur',
      pin_code: '440008',
      created_by: 1,
    },
  });

  // user company mapping
  await prisma.users_company.upsert({
    where: { id: 1 },
    update: {},
    create: {
      user_id: 1,
      company_id: 1,
    },
  });
  await prisma.users_company.upsert({
    where: { id: 2 },
    update: {},
    create: {
      user_id: 1,
      company_id: 2,
    },
  });

  await prisma.users_company.upsert({
    where: { id: 3 },
    update: {},
    create: {
      user_id: 2,
      company_id: 1,
    },
  });

  await prisma.users_company.upsert({
    where: { id: 4 },
    update: {},
    create: {
      user_id: 2,
      company_id: 2,
    },
  });

  await prisma.users_company.upsert({
    where: { id: 5 },
    update: {},
    create: {
      user_id: 3,
      company_id: 1,
    },
  });
  await prisma.users_company.upsert({
    where: { id: 6 },
    update: {},
    create: {
      user_id: 4,
      company_id: 1,
    },
  });
  await prisma.users_company.upsert({
    where: { id: 7 },
    update: {},
    create: {
      user_id: 5,
      company_id: 1,
    },
  });
}
main()
  .then(async () => {
    // eslint-disable-next-line no-console
    console.log('db seed completed');
    await prisma.$disconnect();
  })
  .catch(async e => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
