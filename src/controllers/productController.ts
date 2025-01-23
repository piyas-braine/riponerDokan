import { authenticateUser } from "@/utils/auth";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

type TProductImages = {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
};

// get all products
export const getAllProducts = async () => {
    try {
        const products = await prisma.product.findMany();

        return new NextResponse(JSON.stringify(products), {
            status: 200
        });
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ error: 'Something went wrong' }), {
            status: 500
        });
    }
};


// get product by id
export const getProduct = async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = await params;

    try {
        const product = await prisma.product.findUnique({
            where: {
                id: id
            }
        });

        if (!product) {
            return new NextResponse(JSON.stringify({ error: 'Product not found' }), {
                status: 404
            });
        }

        return new NextResponse(JSON.stringify(product), {
            status: 200
        });
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ error: 'Something went wrong' }), {
            status: 500
        });
    }
};


// add a product
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addProduct = async (req: NextRequest & { files?: any, formData?: any }) => {
    const productInfo = await req.formData;

    const newProductInfo = {
        ...productInfo,
        price: parseFloat(productInfo.price),
        stock: parseInt(productInfo.stock),
    };

    const productImages = req.files as TProductImages[];

    if (!productImages) {
        return new NextResponse("No file uploaded", { status: 400 });
    };

    const productImagesPath = productImages.map((ProductImage: TProductImages) => ProductImage.path.replaceAll('\\', '/'));

    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];

        const isAuthenticated = await authenticateUser({ token: token as string, requiredRole: 'ADMIN' });

        if (!isAuthenticated) {
            return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401
            });
        }

        const product = await prisma.product.create({
            data: {
                name: newProductInfo.name,
                description: newProductInfo.description,
                price: newProductInfo.price,
                stock: newProductInfo.stock,
                productImages: productImagesPath,
                userId: productInfo.userId
            }
        });

        return new NextResponse(JSON.stringify({ message: 'Product added successfully', product: product }), {
            status: 201
        });
    }
    catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ error: 'Something went wrong' }), {
            status: 500
        });
    }
};


// update a product
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateProduct = async (req: NextRequest & { files?: any, formData?: any }, { params }: { params: { id: string } }) => {
    const { id } = await params;

    const productInfo = await req.formData;

    const updateProductInfo = {
        ...productInfo,
        ...(productInfo.price !== undefined && { price: parseFloat(productInfo.price) }),
        ...(productInfo.stock !== undefined && { stock: parseInt(productInfo.stock) }),
    }

    const productImages = req.files as TProductImages[];

    if (productImages?.length > 5) {
        return new NextResponse("You can not upload more than 5 images", { status: 405 });
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

        const product = await prisma.product.findUnique({
            where: {
                id: id
            }
        });

        if (!product) {
            return new NextResponse(JSON.stringify({ error: 'Product not found' }), {
                status: 404
            });
        }

        if (productImages.length > 0) {
            const productImagesPath = productImages.map((ProductImage: TProductImages) => ProductImage.path.replaceAll('\\', '/'));

            const updatedImagesPath = [
                ...(Array.isArray(product?.productImages) ? product.productImages : []),
                ...productImagesPath,
            ];

            if (updatedImagesPath.length > 5) {
                const sliceAmount = updatedImagesPath.length - 5;
                const slicedImagesPath = updatedImagesPath.slice(sliceAmount);

                await prisma.product.update({
                    where: {
                        id: id
                    },
                    data: {
                        ...updateProductInfo,
                        productImages: slicedImagesPath,
                    }
                });

                return new NextResponse(JSON.stringify({ message: 'Product updated successfully' }), {
                    status: 200
                });
            }

            await prisma.product.update({
                where: {
                    id: id
                },
                data: {
                    ...updateProductInfo,
                    productImages: updatedImagesPath,
                }
            });

            return new NextResponse(JSON.stringify({ message: 'Product updated successfully' }), {
                status: 200
            });
        }

        await prisma.product.update({
            where: { id: id }, data: {
                ...updateProductInfo
            }
        });

        return new NextResponse(JSON.stringify({ message: 'Product updated successfully' }), {
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


// delete a product
export const deleteProduct = async (req: NextRequest, { params }: { params: { id: string } }) => {
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

        await prisma.orderItem.deleteMany({
            where: {
                productId: id
            }
        });

        await prisma.product.delete({
            where: {
                id: id
            }
        });

        return new NextResponse(JSON.stringify({ message: 'Product deleted successfully' }), {
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