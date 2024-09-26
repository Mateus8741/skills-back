import fastify from "fastify";
import {
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler
} from "fastify-type-provider-zod";
import { auth } from './middleware/verify-jwt';

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import fastifyCookie from '@fastify/cookie';
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import { LoginUser } from "./routes/Auth/login-user";
import { RegisterUser } from "./routes/Auth/register-user";
import { CreateService } from "./routes/Services/create-service";
import { GetService } from "./routes/Services/get-service";
import { GetServiceById } from "./routes/Services/get-service-by-id";

const app = fastify().withTypeProvider();

app.register(fastifyCookie)
app.register(fastifyJwt, { secret: 'supersecret-skills' })

app.register(fastifyCors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
});

app.register(fastifySwagger, {
    swagger: {
        consumes: ["application/json"],
        produces: ["application/json"],
        info: {
            title: "Skill's API",
            description: "Rotas do Skill's",
            version: "1.0.0",
        },
    },
    transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(auth)

app.register(RegisterUser)
app.register(LoginUser)

app.register(CreateService)
app.register(GetService)
app.register(GetServiceById)

app.listen({
    port: 3100,
    host: "0.0.0.0",
}, () => console.log('Server is running on port 3100'));