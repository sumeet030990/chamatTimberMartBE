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
      country_id: 'IN',
      country_name: 'India',
      state_id: 'MH',
      state_name: 'Maharashtra',
      city_name: 'Nagpur',
      pin_code: '440008',
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
      country_id: 'IN',
      country_name: 'India',
      state_id: 'MH',
      state_name: 'Maharashtra',
      city_name: 'Nagpur',
      pin_code: '440008',
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
    where: { slug: 'customer' },
    update: {},
    create: {
      name: 'Customer',
      slug: 'customer',
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
    where: { name: 'sumeet' },
    update: {},
    create: {
      name: 'sumeet',
      allow_login: true,
      user_name: 'sumeet',
      password: '$2b$10$AxMw./hiWRdCg/OuFG9xUeWGV2GMWFVCKchr1Kslbk.l4dwpCnglm',
      role_id: 1,
      language_id: 1,
      primary_contact: '8408880505',
      country_id: 'IN',
      country_name: 'India',
      state_id: 'MH',
      state_name: 'Maharashtra',
      city_name: 'Nagpur',
      pin_code: '440008',
      created_by: 1,
    },
  });

  await prisma.users.upsert({
    where: { name: 'pratiek' },
    update: {},
    create: {
      name: 'pratiek',
      allow_login: true,
      user_name: 'pratiek',
      password: '$2b$10$AxMw./hiWRdCg/OuFG9xUeWGV2GMWFVCKchr1Kslbk.l4dwpCnglm',
      role_id: 1,
      language_id: 1,
      primary_contact: '9595109394',
      country_id: 'IN',
      country_name: 'India',
      state_id: 'MH',
      state_name: 'Maharashtra',
      city_name: 'Nagpur',
      pin_code: '440008',
      created_by: 1,
    },
  });

  await prisma.users.upsert({
    where: { name: 'customer1' },
    update: {},
    create: {
      name: 'Customer 1',
      allow_login: true,
      user_name: 'customer1',
      password: '$2b$10$AxMw./hiWRdCg/OuFG9xUeWGV2GMWFVCKchr1Kslbk.l4dwpCnglm',
      role_id: 2,
      language_id: 1,
      primary_contact: '0123456789',
      country_id: 'IN',
      country_name: 'India',
      state_id: 'MH',
      state_name: 'Maharashtra',
      city_name: 'Nagpur',
      pin_code: '440008',
      created_by: 1,
    },
  });

  await prisma.users.upsert({
    where: { name: 'customer2' },
    update: {},
    create: {
      name: 'Customer 2',
      allow_login: true,
      user_name: 'customer2',
      password: '$2b$10$AxMw./hiWRdCg/OuFG9xUeWGV2GMWFVCKchr1Kslbk.l4dwpCnglm',
      role_id: 2,
      language_id: 1,
      primary_contact: '999999999',
      country_id: 'IN',
      country_name: 'India',
      state_id: 'MH',
      state_name: 'Maharashtra',
      city_name: 'Pune',
      pin_code: '440008',
      created_by: 1,
    },
  });

  await prisma.users.upsert({
    where: { name: 'employee_operator' },
    update: {},
    create: {
      name: 'Employee Operator',
      allow_login: true,
      user_name: 'employee_operator',
      password: '$2b$10$AxMw./hiWRdCg/OuFG9xUeWGV2GMWFVCKchr1Kslbk.l4dwpCnglm',
      role_id: 3,
      language_id: 1,
      primary_contact: '0123456789',
      country_id: 'IN',
      country_name: 'India',
      state_id: 'MH',
      state_name: 'Maharashtra',
      city_name: 'Nagpur',
      pin_code: '440008',
      created_by: 1,
    },
  });

  await prisma.users.upsert({
    where: { name: 'employee_normal' },
    update: {},
    create: {
      name: 'Employee Normal',
      allow_login: true,
      user_name: 'employee_normal',
      password: '$2b$10$AxMw./hiWRdCg/OuFG9xUeWGV2GMWFVCKchr1Kslbk.l4dwpCnglm',
      role_id: 4,
      language_id: 1,
      primary_contact: '0123456789',
      country_id: 'IN',
      country_name: 'India',
      state_id: 'MH',
      state_name: 'Maharashtra',
      city_name: 'Nagpur',
      pin_code: '440008',
      created_by: 1,
    },
  });

  // user company mapping
  await prisma.users_company.create({
    data: {
      user_id: 1,
      company_id: 1,
    },
  });
  await prisma.users_company.create({
    data: {
      user_id: 1,
      company_id: 2,
    },
  });

  await prisma.users_company.create({
    data: {
      user_id: 2,
      company_id: 1,
    },
  });

  await prisma.users_company.create({
    data: {
      user_id: 2,
      company_id: 2,
    },
  });

  await prisma.users_company.create({
    data: {
      user_id: 3,
      company_id: 1,
    },
  });
  await prisma.users_company.create({
    data: {
      user_id: 4,
      company_id: 2,
    },
  });
  await prisma.users_company.create({
    data: {
      user_id: 5,
      company_id: 1,
    },
  });

  // item
  await prisma.item.create({
    data: {
      name: '1.50*0.50',
      item_code: 'hsin',
      item_type: 'teak_sawn',
      length: 1.5,
      width: 0.5,
      status: true,
    },
  });

  await prisma.item.create({
    data: {
      name: '1.00*0.50',
      item_code: 'hsin',
      item_type: 'teak_sawn',
      length: 1,
      width: 0.5,
      status: true,
    },
  });

  await prisma.item.create({
    data: {
      name: '1.00*10',
      item_code: 'hsin',
      item_type: 'bidding',
      length: 1,
      height: 10,
      status: true,
    },
  });

  await prisma.item.create({
    data: {
      name: 'Mandir',
      item_code: 'hsin',
      item_type: 'mandir',
      status: true,
    },
  });

  await prisma.item.create({
    data: {
      name: 'Bed',
      item_code: 'hsin',
      item_type: 'furniture',
      status: true,
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
