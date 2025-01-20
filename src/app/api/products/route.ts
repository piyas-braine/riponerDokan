import { addProduct, getAllProducts } from "@/controllers/productController";
import multerMiddleware from "@/utils/multerMiddleware";
import { withMiddlewares } from "@/utils/withMiddleware";

export const GET = getAllProducts;
export const POST = withMiddlewares([multerMiddleware], addProduct);