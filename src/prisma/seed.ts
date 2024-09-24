import bcrypt from "bcryptjs";
import { prisma } from "./prisma-client";

async function seed() {
    await prisma.content.deleteMany();
    await prisma.user.deleteMany();

    const users = [
        {
            email: 't@t.com',
            password: '12345678',
            name: 'Tt',
            content: [
                {
                    urlContent: 'https://www.google.com',
                    contentName: 'Google',
                    order: 0,
                },
                {
                    urlContent: 'https://www.facebook.com',
                    contentName: 'Facebook',
                    order: 1,
                },
                {
                    urlContent: 'https://www.twitter.com',
                    contentName: 'Twitter',
                    order: 2,
                },
            ]
        },
        {
            email: 'teste@t.com',
            password: '12345678',
            name: 'Teste',
            content: [
                {
                    urlContent: 'https://www.google.com',
                    contentName: 'Google',
                    order: 0,
                },
                {
                    urlContent: 'https://www.facebook.com',
                    contentName: 'Facebook',
                    order: 1,
                },
                {
                    urlContent: 'https://www.twitter.com',
                    contentName: 'Twitter',
                    order: 2,
                },
            ]
        },
        {
            email: 'test@t.com',
            password: '12345678',
            name: 'Test',
            content: [
                {
                    urlContent: 'https://www.google.com',
                    contentName: 'Google',
                    order: 0,
                },
                {
                    urlContent: 'https://www.facebook.com',
                    contentName: 'Facebook',
                    order: 1,
                },
                {
                    urlContent: 'https://www.twitter.com',
                    contentName: 'Twitter',
                    order: 2,
                },
            ]
        }
    ];

    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10);

        await prisma.user.create({
            data: {
                email: user.email,
                password: hashedPassword,
                name: user.name,
                content: {
                    createMany: {
                        data: user.content,
                    },
                },
            },
        });
    }

    console.log("Users seeded successfully!");
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
