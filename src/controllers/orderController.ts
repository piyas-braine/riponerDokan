import { authenticateUser } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";
import { OrderStatus, PrismaClient } from "@prisma/client";
import { sendOrderConfirmationEmail } from "@/utils/emailService";

const prisma = new PrismaClient();

// types
type TOrderItem = {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
};

type TOrderInfo = {
  customerEmail?: string;
  customerPhone: string;
  address: string;
  totalAmount: number;
  deliveryCharge: number;
  subTotal: number;
  items: TOrderItem[];
};

// get all orders
export const getAllOrders = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const status = searchParams.get('status') as OrderStatus | undefined;

  try {
      const authHeader = req.headers.get('authorization');
      const token = authHeader?.split(' ')[1];

      const isAuthenticated = await authenticateUser({ token: token as string, requiredRole: 'ADMIN' });

      if (!isAuthenticated) {
          return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
              status: 401
          });
      }

      if (status) {
          const orders = await prisma.order.findMany({
              where: {
                  status: status
              },
              include: {
                  items: true
              }
          });

          return new NextResponse(JSON.stringify(orders), {
              status: 200
          });
      }

      const orders = await prisma.order.findMany({
          include: {
              items: true
          }
      });

      return new NextResponse(JSON.stringify(orders), {
          status: 200
      });
  } catch (error) {
      console.log(error);
      return new NextResponse(JSON.stringify({ error: 'Something went wrong' }), {
          status: 500
      });
  }
};

// get an order by id
export const getOrder = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = await params;

  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    const isAuthenticated = await authenticateUser({
      token: token as string,
      requiredRole: "ADMIN",
    });

    if (!isAuthenticated) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return new NextResponse(JSON.stringify({ error: "Order not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(order), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
};

// create an order
export const createOrder = async (req: NextRequest) => {
  const orderInfo: TOrderInfo = await req.json();
  // console.log(orderInfo);
  //   return new NextResponse(JSON.stringify("Hello world"));
  try {
    const order = await prisma.order.create({
      data: {
        ...orderInfo,
        subTotal: Number(orderInfo.totalAmount + orderInfo.deliveryCharge),
        items: {
          create: orderInfo.items.map((item: TOrderItem) => ({
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true, // Include the items relation
      },
    });

    // Send email if customer email is provided
    if (orderInfo.customerEmail) {
      try {
        await sendOrderConfirmationEmail({
          customerEmail: orderInfo.customerEmail,
          orderNumber: order.id,
          items: order.items.map((item) => ({
            productName: item.productName,
            quantity: item.quantity,
            price: Number(item.price), // Convert Decimal to number
          })),
          totalAmount: Number(order.totalAmount),
          deliveryCharge: Number(order.deliveryCharge),
          subTotal: Number(order.subTotal),
          trackingLink: `http://localhost:3000/orders/${order.id}/customer-tracking`,
        });
      } catch (emailError) {
        console.error("Failed to send order confirmation email:", emailError);
        return new NextResponse(
          JSON.stringify({ error: "Failed to send order confirmation email" }),
          {
            status: 500,
          }
        );
      }
    }

    return new NextResponse(
      JSON.stringify({ message: "Order created successfully", order: order }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
};

// update an order's status
export const updateOrder = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = await params;

  if (!id) {
    return new NextResponse(JSON.stringify({ error: "Id not provided" }), {
      status: 404,
    });
  }

  const orderUpdates = await req.json();

  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    const isAuthenticated = await authenticateUser({
      token: token as string,
      requiredRole: "ADMIN",
    });

    if (!isAuthenticated) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await prisma.order.update({
      where: { id },
      data: {
        ...orderUpdates,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: "Order updated successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
};

// delete an order
export const deleteOrder = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = await params;

  if (!id) {
    return new NextResponse(JSON.stringify({ error: "Id not provided" }), {
      status: 404,
    });
  }

  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    const isAuthenticated = await authenticateUser({
      token: token as string,
      requiredRole: "ADMIN",
    });

    if (!isAuthenticated) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Check if order exists before deleting
    const orderExists = await prisma.order.findUnique({
      where: {
        id: id,
      },
    });

    if (!orderExists) {
      return new NextResponse(JSON.stringify({ error: "Order not found" }), {
        status: 404,
      });
    }

    // Delete the related OrderItems first
    await prisma.orderItem.deleteMany({
      where: {
        orderId: id,
      },
    });

    // Now perform the delete operation for the order
    await prisma.order.delete({
      where: {
        id: id,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: "Order deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
};

// customer tracking
export const customerTracking = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = await params;

  try {
    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return new NextResponse(JSON.stringify({ error: "Order not found" }), {
        status: 404,
      });
    }

    return new NextResponse(
      JSON.stringify({
        order: {
          id: order.id,
          items: order.items,
          totalAmount: Number(order.totalAmount),
          deliveryCharge: Number(order.deliveryCharge),
          subTotal: Number(order.subTotal),
          status: order.status,
          trackingId: order.trackingId,
        },
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
};
