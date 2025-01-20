import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import { authenticateUser, generateToken } from '@/utils/auth';

const prisma = new PrismaClient();

export const loginUser = async (
    req: NextRequest
) => {

    try {
        const { email, password } = await req.json();

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return new NextResponse(JSON.stringify({ error: 'Invalid credentials' }), {
                status: 401
            });
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return new NextResponse(JSON.stringify({ error: 'Invalid credentials' }), {
                status: 401
            });
        }

        const token = generateToken(user);

        return new NextResponse(JSON.stringify({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email, role: user.role }, token }), {
            status: 200
        });
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ error: 'Something went wrong' }), {
            status: 500
        });
    }
};

export const registerUser = async (
    req: NextRequest
) => {
    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];

        const isAuthenticated = await authenticateUser({ token: token as string, requiredRole: 'SUPER_ADMIN' });

        if (!isAuthenticated) {
            return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401
            });
        }

        const { name, email, password } = await req.json();

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'ADMIN'
            }
        });

        return new NextResponse(JSON.stringify({ message: 'User created successfully' }), {
            status: 201
        });
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ error: 'Something went wrong' }), {
            status: 500
        });
    }
};

export const registerSuperAdmin = async (req: NextRequest) => {
    const { name, email, password } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'SUPER_ADMIN'
            }
        });

        return new NextResponse(JSON.stringify({ message: 'Super Admin created successfully' }), {
            status: 201
        });
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ error: 'Something went wrong' }), {
            status: 500
        });
    }
};