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

// src/server.ts
var import_fastify = __toESM(require("fastify"));
var import_fastify_type_provider_zod = require("fastify-type-provider-zod");

// src/middleware/verify-jwt.ts
var import_fastify_plugin = __toESM(require("fastify-plugin"));
var auth = (0, import_fastify_plugin.default)(async (app2) => {
  app2.addHook("preHandler", async (request) => {
    request.getCurrentUserId = async () => {
      try {
        const { sub } = await request.jwtVerify();
        return sub;
      } catch {
        throw new Error("Unauthorized");
      }
    };
  });
});

// src/server.ts
var import_swagger = __toESM(require("@fastify/swagger"));
var import_swagger_ui = __toESM(require("@fastify/swagger-ui"));
var import_cookie = __toESM(require("@fastify/cookie"));
var import_cors = __toESM(require("@fastify/cors"));
var import_jwt = __toESM(require("@fastify/jwt"));

// src/routes/Applications/create-application.ts
var import_zod = require("zod");

// src/prisma/prisma-client.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/routes/Applications/create-application.ts
async function CreateApplication(app2) {
  app2.withTypeProvider().post("/applications", {
    schema: {
      body: import_zod.z.object({
        serviceId: import_zod.z.string().cuid()
      }),
      summary: "Create a new application",
      tags: ["Applications"]
    }
  }, async (request, reply) => {
    try {
      const { serviceId } = request.body;
      const userId = await request.getCurrentUserId();
      if (!userId) {
        return reply.status(401).send({ message: "Usu\xE1rio n\xE3o autenticado" });
      }
      const service = await prisma.service.findUnique({
        where: { id: serviceId }
      });
      if (!service) {
        return reply.status(404).send({ message: "Servi\xE7o n\xE3o encontrado" });
      }
      if (service.userId === userId) {
        return reply.status(400).send({
          message: "Voc\xEA n\xE3o pode se candidatar ao seu pr\xF3prio servi\xE7o"
        });
      }
      const existingApplication = await prisma.application.findFirst({
        where: {
          AND: [
            { userId },
            { serviceId }
          ]
        }
      });
      if (existingApplication) {
        return reply.status(400).send({
          message: "Voc\xEA j\xE1 se candidatou a este servi\xE7o"
        });
      }
      const application = await prisma.application.create({
        data: {
          userId,
          serviceId,
          status: "PENDING"
        },
        include: {
          Service: {
            include: {
              serviceLocation: true,
              User: {
                select: {
                  firstName: true,
                  lastName: true,
                  phoneNumber: true
                }
              }
            }
          }
        }
      });
      return reply.status(201).send({
        message: "Candidatura realizada com sucesso",
        application
      });
    } catch (error) {
      console.error("Error creating application:", error);
      return reply.status(500).send({
        message: "Erro ao criar candidatura",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });
}

// src/routes/Auth/forgot-password.ts
var import_bcryptjs = __toESM(require("bcryptjs"));

// src/schemas/change-password-schema.ts
var import_zod2 = require("zod");
var ChangeSchema = import_zod2.z.object({
  old_password: import_zod2.z.string().min(6),
  new_password: import_zod2.z.string().min(6)
});

// src/routes/Auth/forgot-password.ts
async function ForgotPassword(app2) {
  app2.withTypeProvider().patch("/changePassword", {
    schema: {
      body: ChangeSchema,
      summary: "Change password",
      tags: ["Auth"]
    }
  }, async (request, reply) => {
    const { old_password, new_password } = request.body;
    const userId = await request.getCurrentUserId();
    const user = await prisma.user.findFirst({
      where: {
        id: userId
      }
    });
    if (!user) {
      return reply.status(400).send({ message: "Credenciais inv\xE1lidas" });
    }
    const passwordMatch = await import_bcryptjs.default.compare(old_password, user.password);
    if (!passwordMatch) {
      return reply.status(400).send({ message: "Senha antiga inv\xE1lida" });
    }
    const hashedPassword = await import_bcryptjs.default.hash(new_password, 8);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
    return { message: "Password changed successfully" };
  });
}

// src/routes/Auth/login-user.ts
var import_bcryptjs2 = __toESM(require("bcryptjs"));

// src/schemas/register-user-schema.ts
var import_zod3 = require("zod");
var RegisterSchema = import_zod3.z.object({
  firstName: import_zod3.z.string().min(2, "Nome muito curto").max(50, "Nome muito longo"),
  lastName: import_zod3.z.string().min(2, "Sobrenome muito curto").max(50, "Sobrenome muito longo"),
  email: import_zod3.z.string().email("Email inv\xE1lido"),
  phoneNumber: import_zod3.z.string(),
  location: import_zod3.z.object({
    street: import_zod3.z.string().min(2, "Nome da rua muito curto").max(50, "Nome da rua muito longo"),
    neighborhood: import_zod3.z.string().min(2, "Nome do bairro muito curto").max(50, "Nome do bairro muito longo"),
    complement: import_zod3.z.string().optional(),
    reference: import_zod3.z.string().optional(),
    houseNumber: import_zod3.z.number().min(1, "N\xFAmero da casa deve ser maior que 0").int()
  }),
  isAuthenticated: import_zod3.z.boolean().default(false),
  password: import_zod3.z.string().min(6, "Senha muito curta").max(15, "Senha muito longa")
});
var LoginSchema = RegisterSchema.partial();

// src/routes/Auth/login-user.ts
async function LoginUser(app2) {
  app2.withTypeProvider().post(
    "/login",
    {
      schema: {
        body: LoginSchema,
        summary: "Login user",
        tags: ["Auth"]
      }
    },
    async (request, reply) => {
      try {
        const { email, password } = request.body;
        const user = await prisma.user.findFirst({
          where: {
            email
          }
        });
        if (!user) {
          return reply.status(404).send({
            message: "Credenciais inv\xE1lidas"
          });
        }
        const passwordMatch = await import_bcryptjs2.default.compare(password, user.password);
        if (!passwordMatch) {
          return reply.status(401).send({
            message: "Credenciais inv\xE1lidas"
          });
        }
        const accessToken = await reply.jwtSign(
          {
            sub: user.id,
            type: "access_token"
          },
          {
            expiresIn: "30d"
          }
        );
        const refreshToken = await reply.jwtSign(
          {
            sub: user.id,
            type: "refresh_token"
          },
          {
            expiresIn: "30d"
          }
        );
        await prisma.user.update({
          where: { id: user.id },
          data: { refreshToken }
        });
        reply.setCookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24 * 30
        });
        return reply.status(200).send({
          accessToken,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            isAuthenticated: user.isAuthenticated,
            rating: user.rating
          }
        });
      } catch (error) {
        console.error("Error on login user", error);
        return reply.status(500).send({
          message: "Erro interno"
        });
      }
    }
  );
}

// src/routes/Auth/refresh-token.ts
async function RefreshToken(app2) {
  app2.withTypeProvider().post(
    "/refresh",
    {
      schema: {
        summary: "Refresh access token",
        tags: ["Auth"]
      }
    },
    async (request, reply) => {
      try {
        await request.jwtVerify({ onlyCookie: true });
        const userId = await request.getCurrentUserId();
        if (!userId) {
          return reply.status(401).send({
            message: "Usu\xE1rio n\xE3o encontrado"
          });
        }
        const token = await reply.jwtSign(
          {
            sign: {
              sub: userId,
              expiresIn: "30d"
            }
          }
        );
        const refreshToken = await reply.jwtSign(
          {
            sign: {
              sub: userId,
              expiresIn: "30d"
            }
          }
        );
        await prisma.user.update({
          where: { id: userId },
          data: { refreshToken }
        });
        return reply.setCookie("refreshToken", refreshToken, {
          path: "/",
          secure: true,
          sameSite: true,
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 30
        }).status(200).send({
          token
        });
      } catch (error) {
        console.error("Error on refresh token:", error);
        return reply.status(401).send({
          message: "Token inv\xE1lido"
        });
      }
    }
  );
}

// src/routes/Auth/register-user.ts
var import_bcryptjs3 = __toESM(require("bcryptjs"));
async function RegisterUser(app2) {
  app2.withTypeProvider().post("/register", {
    schema: {
      body: RegisterSchema,
      summary: "Register a new user",
      tags: ["Auth"]
    }
  }, async (request, reply) => {
    try {
      const { email, firstName, isAuthenticated, lastName, location, phoneNumber, password } = request.body;
      const { houseNumber, neighborhood, street, complement, reference } = location;
      const alreadyExistsSameEmail = await prisma.user.findFirst({
        where: {
          email
        }
      });
      if (alreadyExistsSameEmail) {
        return reply.status(400).send({
          message: "Usu\xE1rio j\xE1 cadastrado"
        });
      }
      const hashedPassword = await import_bcryptjs3.default.hash(password, 10);
      await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          isAuthenticated,
          location: {
            create: {
              houseNumber,
              neighborhood,
              street,
              complement: complement || "",
              reference: reference || ""
            }
          },
          phoneNumber,
          password: hashedPassword
        }
      });
      return reply.status(201).send({
        message: "Usu\xE1rio cadastrado com sucesso"
      });
    } catch (error) {
      console.error("Error on register user", error);
      return reply.status(500).send({
        message: "Erro ao cadastrar usu\xE1rio"
      });
    }
  });
}

// src/routes/Services/create-service.ts
var import_zod5 = require("zod");

// src/schemas/register-service-schema.ts
var import_zod4 = require("zod");
var Category = import_zod4.z.enum([
  "ELECTRICIAN",
  "PAINTER",
  "BRICKLAYER",
  "GARDENER",
  "PLUMBER",
  "CLEANER",
  "BABYSITTER",
  "OTHERS"
]).default("OTHERS");
var ServiceSchema = import_zod4.z.object({
  name: import_zod4.z.string().min(2, "Nome muito curto").max(50, "Nome muito longo"),
  description: import_zod4.z.string().min(2, "Descri\xE7\xE3o muito curta").max(50, "Descri\xE7\xE3o muito longa"),
  category: Category,
  price: (0, import_zod4.number)().positive(),
  location: import_zod4.z.object({
    city: import_zod4.z.string().min(2, "Nome da cidade muito curto").max(50, "Nome da cidade muito longo"),
    state: import_zod4.z.string().length(2, "Estado deve ter 2 caracteres"),
    street: import_zod4.z.string().min(2, "Nome da rua muito curto").max(50, "Nome da rua muito longo"),
    neighborhood: import_zod4.z.string().min(2, "Nome do bairro muito curto").max(50, "Nome do bairro muito longo"),
    complement: import_zod4.z.string().optional().default(""),
    reference: import_zod4.z.string().optional().default(""),
    number: (0, import_zod4.number)().positive("N\xFAmero deve ser positivo").int().optional().default(0),
    latitude: (0, import_zod4.number)().default(0),
    longitude: (0, import_zod4.number)().default(0)
  })
});

// src/routes/Services/create-service.ts
async function CreateService(app2) {
  app2.withTypeProvider().post("/service", {
    schema: {
      body: import_zod5.z.array(ServiceSchema),
      summary: "Create new services",
      tags: ["Services"]
    }
  }, async (request, reply) => {
    try {
      const services = request.body;
      const userId = await request.getCurrentUserId();
      const user = await prisma.user.findFirst({
        where: { id: userId }
      });
      if (!user) {
        return reply.status(404).send({
          message: "User not found"
        });
      }
      const createdServices = await prisma.$transaction(
        services.map((service) => {
          const { category, description, location, name, price } = service;
          return prisma.service.create({
            data: {
              name,
              description,
              price,
              category,
              userPhoneNumber: user.phoneNumber,
              rating: 0,
              isAuthenticaded: false,
              userId: user.id,
              serviceLocation: {
                create: {
                  city: location.city,
                  state: location.state,
                  street: location.street,
                  complement: location.complement,
                  neighborhood: location.neighborhood,
                  reference: location.reference,
                  number: location.number,
                  latitude: location.latitude,
                  longitude: location.longitude
                }
              }
            },
            include: {
              serviceLocation: true
            }
          });
        })
      );
      return reply.status(201).send({
        message: "Servi\xE7os criados com sucesso",
        services: createdServices
      });
    } catch (error) {
      console.error(error);
      if (error instanceof Error && error.message.includes("unauthorized")) {
        return reply.status(401).send({
          message: "Usu\xE1rio n\xE3o autenticado"
        });
      }
      return reply.status(500).send({
        message: "Erro ao criar servi\xE7os"
      });
    }
  });
}

// src/routes/Services/delete-account.ts
var import_bcryptjs4 = __toESM(require("bcryptjs"));

// src/schemas/delete-accoung-shema.ts
var import_zod6 = __toESM(require("zod"));
var DeleteAccountSchema = import_zod6.default.object({
  password: import_zod6.default.string().min(6, "Senha deve ter pelo menos 6 caracteres")
});

// src/routes/Services/delete-account.ts
async function DeleteAccount(app2) {
  app2.withTypeProvider().delete("/users/account", {
    schema: {
      body: DeleteAccountSchema,
      summary: "Delete user account",
      tags: ["Users"]
    }
  }, async (request, reply) => {
    try {
      const { password } = request.body;
      const userId = await request.getCurrentUserId();
      if (!userId) {
        return reply.status(401).send({ message: "Usu\xE1rio n\xE3o autenticado" });
      }
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          Service: {
            include: {
              serviceLocation: true,
              Application: true
            }
          },
          location: true,
          Application: true
        }
      });
      if (!user) {
        return reply.status(404).send({ message: "Usu\xE1rio n\xE3o encontrado" });
      }
      const passwordMatch = await import_bcryptjs4.default.compare(password, user.password);
      if (!passwordMatch) {
        return reply.status(400).send({ message: "Senha incorreta" });
      }
      await prisma.$transaction(async (tx) => {
        await tx.application.deleteMany({
          where: { userId }
        });
        await tx.serviceLocation.deleteMany({
          where: {
            serviceId: {
              in: user.Service.map((service) => service.id)
            }
          }
        });
        await tx.service.deleteMany({
          where: { userId }
        });
        await tx.location.deleteMany({
          where: { userId }
        });
        await tx.serviceReport.deleteMany({
          where: { userId }
        });
        await tx.user.delete({
          where: { id: userId }
        });
      });
      return reply.status(200).send({
        message: "Conta exclu\xEDda com sucesso"
      });
    } catch (error) {
      console.error("Error deleting account:", error);
      return reply.status(500).send({
        message: "Erro ao excluir conta",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });
}

// src/routes/Services/get-service.ts
async function GetService(app2) {
  app2.withTypeProvider().get("/service", {
    schema: {
      summary: "Get all services",
      tags: ["Services"]
    }
  }, async (request, reply) => {
    try {
      const services = await prisma.service.findMany({
        include: {
          serviceLocation: true,
          User: {
            select: {
              phoneNumber: true,
              firstName: true,
              lastName: true,
              rating: true,
              isAuthenticated: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      });
      const formattedServices = services.map((service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        category: service.category,
        rating: service.rating,
        isAuthenticaded: service.isAuthenticaded,
        createdAt: service.createdAt,
        location: service.serviceLocation[0],
        userPhoneNumber: service.User.phoneNumber,
        provider: {
          firstName: service.User.firstName,
          lastName: service.User.lastName,
          rating: service.User.rating,
          isAuthenticated: service.User.isAuthenticated
        }
      }));
      return reply.status(200).send(formattedServices);
    } catch (error) {
      console.error("Error fetching services:", error);
      if (error instanceof Error && error.message.includes("unauthorized")) {
        return reply.status(401).send({
          message: "Usu\xE1rio n\xE3o autenticado"
        });
      }
      return reply.status(500).send({
        message: "Erro ao buscar servi\xE7os"
      });
    }
  });
}

// src/routes/Services/get-service-by-id.ts
var import_zod7 = require("zod");
async function GetServiceById(app2) {
  app2.withTypeProvider().get("/service/:serviceId", {
    schema: {
      params: import_zod7.z.object({
        serviceId: import_zod7.z.string().cuid()
      }),
      summary: "Get a service by id",
      tags: ["Services"]
    }
  }, async (request, reply) => {
    const { serviceId } = request.params;
    const userId = request.getCurrentUserId();
    if (!userId) {
      return reply.status(401).send({ error: "Usu\xE1rio n\xE3o autenticado" });
    }
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId
      },
      include: {
        serviceLocation: true,
        User: {
          select: {
            phoneNumber: true
          }
        }
      }
    });
    if (!service) {
      return reply.status(404).send({ error: "Servi\xE7o n\xE3o encontrado" });
    }
    const formattedService = {
      ...service,
      price: service.price.toString(),
      location: service.serviceLocation[0],
      userPhoneNumber: service.User.phoneNumber
    };
    return reply.status(200).send(formattedService);
  });
}

// src/routes/Services/get-user-services.ts
async function GetUserServices(app2) {
  app2.withTypeProvider().get("/user/services", {
    schema: {
      summary: "Get all services published by the logged user",
      tags: ["Services"]
    }
  }, async (request, reply) => {
    try {
      const userId = await request.getCurrentUserId();
      if (!userId) {
        return reply.status(401).send({ message: "Usu\xE1rio n\xE3o autenticado" });
      }
      const services = await prisma.service.findMany({
        where: {
          userId
        },
        include: {
          serviceLocation: true,
          User: {
            select: {
              phoneNumber: true,
              firstName: true,
              lastName: true,
              rating: true,
              isAuthenticated: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      });
      const formattedServices = services.map((service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price.toString(),
        category: service.category,
        rating: service.rating,
        isAuthenticaded: service.isAuthenticaded,
        createdAt: service.createdAt,
        location: service.serviceLocation[0],
        userPhoneNumber: service.User.phoneNumber,
        provider: {
          firstName: service.User.firstName,
          lastName: service.User.lastName,
          rating: service.User.rating,
          isAuthenticated: service.User.isAuthenticated
        }
      }));
      return reply.status(200).send(formattedServices);
    } catch (error) {
      console.error("Error fetching user services:", error);
      return reply.status(500).send({
        message: "Erro ao buscar servi\xE7os do usu\xE1rio",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });
}

// src/routes/Services/report-service.ts
var import_zod8 = require("zod");
var ReportSchema = import_zod8.z.object({
  serviceId: import_zod8.z.string().cuid(),
  reason: import_zod8.z.string().min(10, "A raz\xE3o deve ter pelo menos 10 caracteres"),
  description: import_zod8.z.string().min(20, "A descri\xE7\xE3o deve ter pelo menos 20 caracteres")
});
async function ReportService(app2) {
  app2.withTypeProvider().post("/services/report", {
    schema: {
      body: ReportSchema,
      summary: "Report a service problem",
      tags: ["Services"]
    }
  }, async (request, reply) => {
    try {
      const { serviceId, reason, description } = request.body;
      const userId = await request.getCurrentUserId();
      if (!userId) {
        return reply.status(401).send({ message: "Usu\xE1rio n\xE3o autenticado" });
      }
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
        include: {
          User: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });
      if (!service) {
        return reply.status(404).send({ message: "Servi\xE7o n\xE3o encontrado" });
      }
      const report = await prisma.serviceReport.create({
        data: {
          reason,
          description,
          userId,
          serviceId,
          status: "PENDING"
        },
        include: {
          User: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          Service: {
            select: {
              name: true,
              description: true
            }
          }
        }
      });
      return reply.status(201).send({
        message: "Den\xFAncia enviada com sucesso",
        report
      });
    } catch (error) {
      console.error("Error reporting service:", error);
      return reply.status(500).send({
        message: "Erro ao reportar servi\xE7o",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });
}

// src/routes/Users/change-password.ts
var import_bcryptjs5 = __toESM(require("bcryptjs"));
var import_zod9 = require("zod");
var ChangePasswordSchema = import_zod9.z.object({
  currentPassword: import_zod9.z.string().min(6, "A senha atual deve ter pelo menos 6 caracteres"),
  newPassword: import_zod9.z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
  confirmPassword: import_zod9.z.string().min(6, "A confirma\xE7\xE3o de senha deve ter pelo menos 6 caracteres")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas n\xE3o coincidem",
  path: ["confirmPassword"]
});
async function ChangePassword(app2) {
  app2.withTypeProvider().patch("/users/change-password", {
    schema: {
      body: ChangePasswordSchema,
      summary: "Change user password",
      tags: ["Users"]
    }
  }, async (request, reply) => {
    try {
      const { currentPassword, newPassword } = request.body;
      const userId = await request.getCurrentUserId();
      if (!userId) {
        return reply.status(401).send({ message: "Usu\xE1rio n\xE3o autenticado" });
      }
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      if (!user) {
        return reply.status(404).send({ message: "Usu\xE1rio n\xE3o encontrado" });
      }
      const passwordMatch = await import_bcryptjs5.default.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return reply.status(400).send({ message: "Senha atual incorreta" });
      }
      const hashedPassword = await import_bcryptjs5.default.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
      });
      return reply.status(200).send({
        message: "Senha alterada com sucesso"
      });
    } catch (error) {
      console.error("Error changing password:", error);
      return reply.status(500).send({
        message: "Erro ao alterar senha",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });
}

// src/routes/Users/update-profile.ts
var import_zod10 = require("zod");
var UpdateProfileSchema = import_zod10.z.object({
  firstName: import_zod10.z.string().optional(),
  lastName: import_zod10.z.string().optional(),
  phoneNumber: import_zod10.z.string().optional(),
  email: import_zod10.z.string().email().optional(),
  location: import_zod10.z.object({
    street: import_zod10.z.string().optional(),
    neighborhood: import_zod10.z.string().optional(),
    houseNumber: import_zod10.z.number().optional(),
    complement: import_zod10.z.string().optional(),
    reference: import_zod10.z.string().optional()
  }).optional()
});
async function UpdateProfile(app2) {
  app2.withTypeProvider().put("/users/profile", {
    schema: {
      body: UpdateProfileSchema,
      summary: "Update user profile",
      tags: ["Users"]
    }
  }, async (request, reply) => {
    try {
      const userId = await request.getCurrentUserId();
      const updateData = request.body;
      if (!userId) {
        return reply.status(401).send({ message: "Usu\xE1rio n\xE3o autenticado" });
      }
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { location: true }
      });
      if (!user) {
        return reply.status(404).send({ message: "Usu\xE1rio n\xE3o encontrado" });
      }
      if (updateData.email && updateData.email !== user.email) {
        const existingUser = await prisma.user.findFirst({
          where: {
            email: updateData.email,
            NOT: { id: userId }
          }
        });
        if (existingUser) {
          return reply.status(400).send({ message: "Email j\xE1 est\xE1 em uso" });
        }
      }
      const updatedUser = await prisma.$transaction(async (tx) => {
        if (updateData.location) {
          await tx.location.update({
            where: { id: user.location[0].id },
            data: updateData.location
          });
        }
        const { location, ...userData } = updateData;
        return tx.user.update({
          where: { id: userId },
          data: userData,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            isAuthenticated: true,
            rating: true,
            location: true
          }
        });
      });
      return reply.status(200).send({
        message: "Perfil atualizado com sucesso",
        user: updatedUser
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      return reply.status(500).send({
        message: "Erro ao atualizar perfil",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });
}

// src/server.ts
var app = (0, import_fastify.default)().withTypeProvider();
app.register(import_cookie.default);
app.register(import_jwt.default, { secret: "supersecret-skills" });
app.register(import_cors.default, {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
});
app.register(import_swagger.default, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "Skill's API",
      description: "Rotas do Skill's",
      version: "1.0.0"
    }
  },
  transform: import_fastify_type_provider_zod.jsonSchemaTransform
});
app.register(import_swagger_ui.default, {
  routePrefix: "/docs"
});
app.setValidatorCompiler(import_fastify_type_provider_zod.validatorCompiler);
app.setSerializerCompiler(import_fastify_type_provider_zod.serializerCompiler);
app.register(auth);
app.register(RegisterUser);
app.register(LoginUser);
app.register(RefreshToken);
app.register(ForgotPassword);
app.register(CreateService);
app.register(GetService);
app.register(GetServiceById);
app.register(GetUserServices);
app.register(CreateApplication);
app.register(ReportService);
app.register(UpdateProfile);
app.register(ChangePassword);
app.register(DeleteAccount);
app.listen({
  port: 3100,
  host: "0.0.0.0"
}, () => console.log("Server is running on port 3100"));
