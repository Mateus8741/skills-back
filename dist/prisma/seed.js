"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/prisma/seed.ts
var import_client = require("@prisma/client");
var import_bcryptjs = __toESM(require("bcryptjs"));
var prisma = new import_client.PrismaClient();
async function main() {
  await prisma.user.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceLocation.deleteMany();
  await prisma.location.deleteMany();
  const password = await import_bcryptjs.default.hash("123456", 10);
  const user1 = await prisma.user.create({
    data: {
      firstName: "Jo\xE3o",
      lastName: "Silva",
      email: "joao@example.com",
      password,
      phoneNumber: "11999999999",
      isAuthenticated: true,
      rating: 4.5,
      location: {
        create: {
          street: "Rua das Flores",
          neighborhood: "Centro",
          complement: "Apto 101",
          reference: "Pr\xF3ximo ao mercado",
          houseNumber: 123
        }
      }
    }
  });
  const user2 = await prisma.user.create({
    data: {
      firstName: "Maria",
      lastName: "Santos",
      email: "maria@example.com",
      password,
      phoneNumber: "11988888888",
      isAuthenticated: true,
      rating: 4.8,
      location: {
        create: {
          street: "Avenida Principal",
          neighborhood: "Jardim Am\xE9rica",
          complement: "Casa",
          reference: "Pr\xF3ximo \xE0 farm\xE1cia",
          houseNumber: 456
        }
      }
    }
  });
  const user3 = await prisma.user.create({
    data: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password,
      phoneNumber: "123456789",
      isAuthenticated: false,
      rating: 4.5,
      location: {
        create: {
          street: "123 Main St",
          neighborhood: "Downtown",
          complement: "Apt 4B",
          reference: "Near Central Park",
          houseNumber: 123
        }
      }
    }
  });
  await prisma.service.create({
    data: {
      name: "Encanamento Residencial",
      description: "Servi\xE7o completo de encanamento residencial",
      price: 120,
      category: import_client.Category.PLUMBER,
      userPhoneNumber: user3.phoneNumber,
      rating: 4.6,
      isAuthenticaded: true,
      userId: user3.id,
      serviceLocation: {
        create: {
          city: "S\xE3o Paulo",
          state: "SP",
          street: "Rua dos Encanadores",
          neighborhood: "Vila Mariana",
          complement: "Casa 1",
          reference: "Pr\xF3ximo \xE0 escola",
          number: 456,
          latitude: -23.54052,
          longitude: -46.623308
        }
      }
    }
  });
  await prisma.service.create({
    data: {
      name: "Instala\xE7\xE3o El\xE9trica",
      description: "Servi\xE7o completo de instala\xE7\xE3o el\xE9trica residencial",
      price: 150,
      category: import_client.Category.ELECTRICIAN,
      userPhoneNumber: user1.phoneNumber,
      rating: 4.7,
      isAuthenticaded: false,
      userId: user1.id,
      serviceLocation: {
        create: {
          city: "S\xE3o Paulo",
          state: "SP",
          street: "Rua dos Eletricistas",
          neighborhood: "Vila Nova",
          complement: "Sala 3",
          reference: "Pr\xF3ximo ao posto de gasolina",
          number: 789,
          latitude: -23.55052,
          longitude: -46.633308
        }
      }
    }
  });
  await prisma.service.create({
    data: {
      name: "Pintura Residencial",
      description: "Pintura completa de casas e apartamentos",
      price: 200,
      category: import_client.Category.PAINTER,
      userPhoneNumber: user1.phoneNumber,
      rating: 4.5,
      isAuthenticaded: true,
      userId: user1.id,
      serviceLocation: {
        create: {
          city: "S\xE3o Paulo",
          state: "SP",
          street: "Rua dos Pintores",
          neighborhood: "Jardim Paulista",
          complement: "",
          reference: "Pr\xF3ximo \xE0 pra\xE7a",
          number: 321,
          latitude: -23.561778,
          longitude: -46.655293
        }
      }
    }
  });
  await prisma.service.create({
    data: {
      name: "Limpeza Residencial",
      description: "Limpeza completa de resid\xEAncias",
      price: 120,
      category: import_client.Category.CLEANER,
      userPhoneNumber: user2.phoneNumber,
      rating: 4.9,
      isAuthenticaded: true,
      userId: user2.id,
      serviceLocation: {
        create: {
          city: "S\xE3o Paulo",
          state: "SP",
          street: "Rua da Limpeza",
          neighborhood: "Moema",
          complement: "Casa 2",
          reference: "Pr\xF3ximo ao shopping",
          number: 654,
          latitude: -23.571778,
          longitude: -46.665293
        }
      }
    }
  });
  await prisma.service.create({
    data: {
      name: "Jardinagem Profissional",
      description: "Manuten\xE7\xE3o completa de jardins",
      price: 180,
      category: import_client.Category.GARDENER,
      userPhoneNumber: user2.phoneNumber,
      rating: 4.6,
      isAuthenticaded: true,
      userId: user2.id,
      serviceLocation: {
        create: {
          city: "S\xE3o Paulo",
          state: "SP",
          street: "Rua dos Jardins",
          neighborhood: "Pinheiros",
          complement: "",
          reference: "Pr\xF3ximo ao parque",
          number: 987,
          latitude: -23.581778,
          longitude: -46.675293
        }
      }
    }
  });
  console.log("Seed completed successfully!");
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
