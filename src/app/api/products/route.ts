import { addProduct } from "@/controllers/productController";
import multerMiddleware from "@/utils/multerMiddleware";
import { withMiddlewares } from "@/utils/withMiddleware";

export const POST = withMiddlewares([multerMiddleware], addProduct);