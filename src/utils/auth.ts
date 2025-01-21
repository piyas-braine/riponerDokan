import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

type User = {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'SUPER_ADMIN';
};

const prisma = new PrismaClient();

export const generateToken = (user: User) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '1d' }
    );
};

export const authenticateUser = async ({ token, requiredRole }: { token: string, requiredRole?: 'ADMIN' | 'SUPER_ADMIN' }) => {
    try {
        if (!token) {
            return false;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, email: string, role: 'ADMIN' | 'SUPER_ADMIN' };

        if (!decoded) {
            return false;
        }

        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if (!user) {
            return false;
        }

        if(user.role === 'SUPER_ADMIN') {
            return true;
        }

        if (requiredRole && user.role !== requiredRole) {
            return false;
        }

        if(user.isActive === false) {
            return false;
        }

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}