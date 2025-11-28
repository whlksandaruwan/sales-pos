import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const roles = await prisma.$transaction([
    prisma.role.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, name: 'Admin' },
    }),
    prisma.role.upsert({
      where: { id: 2 },
      update: {},
      create: { id: 2, name: 'Manager' },
    }),
    prisma.role.upsert({
      where: { id: 3 },
      update: {},
      create: { id: 3, name: 'Cashier' },
    }),
  ]);

  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const managerPasswordHash = await bcrypt.hash('manager123', 10);
  const cashierPasswordHash = await bcrypt.hash('cashier123', 10);

  const store = await prisma.store.upsert({
    where: { code: 'MAIN' },
    update: {},
    create: {
      name: 'Main Bookshop',
      code: 'MAIN',
      address: '123 Main Street',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@bookshop.local' },
    update: {},
    create: {
      email: 'admin@bookshop.local',
      fullName: 'System Admin',
      passwordHash: adminPasswordHash,
      roleId: roles.find((r) => r.name === 'Admin')!.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'manager@bookshop.local' },
    update: {},
    create: {
      email: 'manager@bookshop.local',
      fullName: 'Store Manager',
      passwordHash: managerPasswordHash,
      roleId: roles.find((r) => r.name === 'Manager')!.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'cashier@bookshop.local' },
    update: {},
    create: {
      email: 'cashier@bookshop.local',
      fullName: 'Front Cashier',
      passwordHash: cashierPasswordHash,
      roleId: roles.find((r) => r.name === 'Cashier')!.id,
    },
  });

  const category = await prisma.category.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Fiction',
    },
  });

  const supplier = await prisma.supplier.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Book Distributors Ltd',
      contact: 'contact@bookdist.com / +94112345678 / 123 Main St, Colombo',
    },
  });

  const product = await prisma.product.upsert({
    where: { sku: 'BOOK-001' },
    update: {},
    create: {
      name: 'Sample Book',
      sku: 'BOOK-001',
      isbn: '9780000000001',
      barcode: '100000000001',
      categoryId: category.id,
      supplierId: supplier.id,
      price: 19.99,
      cost: 10.0,
      unit: 'pcs',
      reorderThreshold: 5,
    },
  });

  await prisma.stock.upsert({
    where: {
      productId_storeId: {
        productId: product.id,
        storeId: store.id,
      },
    },
    update: {
      quantity: 50,
    },
    create: {
      productId: product.id,
      storeId: store.id,
      quantity: 50,
    },
  });

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


