import { NextRequest } from "next/server";

import { PrismaClient } from "@prisma/client";
import { authenticateUser } from "@/utils/auth";

const prisma = new PrismaClient();


export const GET = async (req: NextRequest) => {
    try {
        const authHeader = req.headers.get("authorization");
        const token = authHeader?.split(" ")[1];

        const isAuthenticated = await authenticateUser({
            token: token as string,
            requiredRole: "ADMIN",
        });

        if (!isAuthenticated) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }

        const orders = await prisma.order.findMany();

        // total orders
        const ordersCount = orders.length;

        // orders pending
        const ordersPendingCount = orders.filter((order) => order.status === "PENDING").length;

        // orders processing
        const ordersProcessingCount = orders.filter((order) => order.status === "PROCESSING").length;

        // orders shipped
        const ordersShippedCount = orders.filter((order) => order.status === "SHIPPED").length;

        // orders delivered
        const ordersDeliveredCount = orders.filter((order) => order.status === "DELIVERED").length;

        // orders cancelled
        const ordersCancelledCount = orders.filter((order) => order.status === "CANCELLED").length;


        const now = new Date();

        const dailyOrders = orders.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate.toDateString() === now.toDateString(); // Same day
        });

        const weeklyOrders = orders.filter((order) => {
            const orderDate = new Date(order.createdAt);

            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay()); // Start of the week (Sunday)

            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 7); // End of the week (Saturday)

            return orderDate >= weekStart && orderDate < weekEnd;
        });

        const monthlyOrders = orders.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return (
                orderDate.getFullYear() === now.getFullYear() &&
                orderDate.getMonth() === now.getMonth() // Same year and month
            );
        });

        // Calculate daily, weekly, and monthly orders
        const dailyOrdersCount = dailyOrders.length;

        const weeklyOrdersCount = weeklyOrders.length;

        const monthlyOrdersCount = monthlyOrders.length;

        // Calculate daily, weekly, and monthly income
        const dailyIncome = dailyOrders.reduce(
            (total: number, order) => total + order.subTotal.toNumber(),
            0
        );

        const weeklyIncome = weeklyOrders.reduce(
            (total: number, order) => total + order.subTotal.toNumber(),
            0
        );

        const monthlyIncome = monthlyOrders.reduce(
            (total: number, order) => total + order.subTotal.toNumber(),
            0
        );

        return new Response(
            JSON.stringify({
                ordersCount,
                ordersPendingCount,
                ordersProcessingCount,
                ordersShippedCount,
                ordersDeliveredCount,
                ordersCancelledCount,
                dailyOrdersCount,
                weeklyOrdersCount,
                monthlyOrdersCount,
                dailyIncome,
                weeklyIncome,
                monthlyIncome,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify(error), { status: 500 });
    }
}