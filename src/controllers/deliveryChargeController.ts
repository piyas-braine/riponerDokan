
import { authenticateUser } from "@/utils/auth";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// get all delivery charges
export const getAllDeliveryCharges = async (req: NextRequest) => {
    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];

        const isAuthenticated = await authenticateUser({ token: token as string, requiredRole: 'ADMIN' });

        if (!isAuthenticated) {
            return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401
            });
        }

        const deliveryCharges = await prisma.deliveryCharge.findMany();

        return new NextResponse(JSON.stringify(deliveryCharges), {
            status: 200
        });
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ error: 'Something went wrong' }), {
            status: 500
        });
    }
};


// get delivery charge by id
export const getDeliveryCharge = async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = await params;

    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];

        const isAuthenticated = await authenticateUser({ token: token as string, requiredRole: 'ADMIN' });

        if (!isAuthenticated) {
            return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401
            });
        }

        const deliveryCharge = await prisma.deliveryCharge.findUnique({
            where: {
                id: id
            }
        });

        if (!deliveryCharge) {
            return new NextResponse(JSON.stringify({ error: 'Delivery charge not found' }), {
                status: 404
            });
        }

        return new NextResponse(JSON.stringify(deliveryCharge), {
            status: 200
        });
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ error: 'Something went wrong' }), {
            status: 500
        });
    }
};


// add a delivery charge
export const addDeliveryCharge = async (req: NextRequest) => {
    const deliveryChargeInfo = await req.json();

    const newDeliveryChargeInfo = {
        ...deliveryChargeInfo,
        amount: parseFloat(deliveryChargeInfo.amount),
    };

    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];

        const isAuthenticated = await authenticateUser({ token: token as string, requiredRole: 'ADMIN' });

        if (!isAuthenticated) {
            return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401
            });
        }

        const deliveryCharge = await prisma.deliveryCharge.create({ data: newDeliveryChargeInfo });

        return new NextResponse(JSON.stringify({ message: 'Delivery charge added successfully', deliveryCharge: deliveryCharge }), {
            status: 201
        });
    }
    catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ error: 'Something went wrong' }), {
            status: 500
        });
    }
}

export const updateDeliveryCharge = async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = await params;

    const deliveryChargeInfo = await req.json();

    const updateDeliveryChargeInfo = {
        ...deliveryChargeInfo,
        ...(deliveryChargeInfo.amount !== undefined && { amount: parseFloat(deliveryChargeInfo.amount) }),
    }

    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];

        const isAuthenticated = await authenticateUser({ token: token as string, requiredRole: 'ADMIN' });

        if (!isAuthenticated) {
            return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401
            });
        }

        const deliveryCharge = await prisma.deliveryCharge.findUnique({
            where: {
                id: id
            }
        });

        if (!deliveryCharge) {
            return new NextResponse(JSON.stringify({ error: 'Delivery charge not found' }), {
                status: 404
            });
        }

        if (deliveryCharge.amount !== updateDeliveryChargeInfo.amount) {
            await prisma.deliveryCharge.update({
                where: {
                    id: id
                },
                data: {
                    ...updateDeliveryChargeInfo
                }
            });

            return new NextResponse(JSON.stringify({ message: 'Delivery charge updated successfully' }), {
                status: 200
            });
        }

        return new NextResponse(JSON.stringify({ message: 'Delivery charge updated successfully' }), {
            status: 200
        });
    }
    catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ error: 'Something went wrong' }), {
            status: 500
        });
    }
};


// delete a delivery charge
export const deleteDeliveryCharge = async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = await params;

    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];

        const isAuthenticated = await authenticateUser({ token: token as string, requiredRole: 'ADMIN' });

        if (!isAuthenticated) {
            return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401
            });
        }

        const deliveryCharge = await prisma.deliveryCharge.findUnique({
            where: {
                id: id
            }
        });

        if (!deliveryCharge) {
            return new NextResponse(JSON.stringify({ error: 'Delivery charge not found' }), {
                status: 404
            });
        }

        await prisma.deliveryCharge.delete({
            where: {
                id: id
            }
        });

        return new NextResponse(JSON.stringify({ message: 'Delivery charge deleted successfully' }), {
            status: 200
        });
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ error: 'Something went wrong' }), {
            status: 500
        });
    }
};



