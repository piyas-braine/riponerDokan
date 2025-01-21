import { deleteProduct, getProduct, updateProduct } from "@/controllers/productController";
import multerMiddleware from "@/utils/multerMiddleware";
import { withMiddlewares } from "@/utils/withMiddleware";
import { NextRequest, NextResponse } from "next/server";

export const GET = getProduct;

export const PATCH = withMiddlewares([multerMiddleware], async (req: NextRequest,) => {
    console.log(req.nextUrl.pathname);
    const id = req.nextUrl.pathname.split("/")[3];

    console.log(id);

    if (!id) {
        return new NextResponse("No product id provided", { status: 400 });
    }

    return updateProduct(req, { params: { id: id } });
});

export const DELETE = deleteProduct;