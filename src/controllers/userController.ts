import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import { authenticateUser, generateToken } from '@/utils/auth';

const prisma = new PrismaClient();

export const getAllUsers = async (req: NextRequest) => {
    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];

        const isAuthenticated = await authenticateUser({ token: token as string, requiredRole: 'SUPER_ADMIN' });

        if (!isAuthenticated) {
            return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401
            });
        }

        const users = await prisma.user.findMany({
            where: {
                role: 'ADMIN'
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return new NextResponse(JSON.stringify(users), {
            status: 200
        });
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ error: 'Something went wrong' }), {
            status: 500
        });
    }
};


export const getUser = async (req: NextRequest, { params }: { params: Promise<{ email: string }> }) => {
    const { email } = await params;

    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];

        const isAuthenticated = await authenticateUser({ token: token as string, requiredRole: 'ADMIN' });

        if (!isAuthenticated) {
            return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            return new NextResponse(JSON.stringify({ error: 'User not found' }), {
                status: 404
            });
        }

        return new NextResponse(JSON.stringify(user), {
            status: 200
        });
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ error: 'Something went wrong' }), {
            status: 500
        });
    }
};


export const loginUser = async (
    req: NextRequest
) => {

    try {
        const { email, password } = await req.json();

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return new NextResponse(JSON.stringify({ error: 'User Not Found...' }), {
                status: 404
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

        console.log("hashedPassword..:" + hashedPassword)

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

    console.log("hashedPassword..:" + hashedPassword)

    try {
       const res =  await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'SUPER_ADMIN'
            }
        });

        return new NextResponse(JSON.stringify({ message: 'Super Admin created successfully',hashedPassword , res}), {
            status: 201
        });
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ error: 'Something went wrong' , msgError: error }), {
            status: 500
        });
    }
};

// update user 

export const updateUser = async (req: NextRequest, { params }: { params: Promise<{ email: string }> }) => {
    const { email } = await params;

    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];

        const isAuthenticated = await authenticateUser({ token: token as string, requiredRole: 'SUPER_ADMIN' });

        if (!isAuthenticated) {
            return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401
            });
        }

        const userInfo = await req.json();

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            return new NextResponse(JSON.stringify({ error: 'User not found' }), {
                status: 404
            });
        }

        await prisma.user.update({
            where: {
                email: email
            },
            data: {
                ...userInfo
            }
        });

        return new NextResponse(JSON.stringify({ message: 'User updated successfully' }), {
            status: 200
        });
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ error: 'Something went wrong' }), {
            status: 500
        });
    }
};

export const deleteUser = async (req: NextRequest, { params }: { params: Promise<{ email: string }> }) => {
    const { email } = await params;

    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];

        const isAuthenticated = await authenticateUser({ token: token as string, requiredRole: 'SUPER_ADMIN' });

        if (!isAuthenticated) {
            return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            return new NextResponse(JSON.stringify({ error: 'User not found' }), {
                status: 404
            });
        }

        await prisma.user.delete({
            where: {
                email: email
            }
        });

        return new NextResponse(JSON.stringify({ message: 'User deleted successfully' }), {
            status: 200
        });
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ error: 'Something went wrong' }), {
            status: 500
        });
    }
};