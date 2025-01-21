import { NextRequest, NextResponse } from "next/server";

type Middleware = (req: NextRequest, next: (err?: unknown | Error) => void) => Promise<void>;

export const withMiddlewares = (
    middlewares: Middleware[],
    handler: (req: NextRequest) => Promise<NextResponse>
) => async (req: NextRequest): Promise<NextResponse> => {
    try {

        // Call the middlewares
        for (const middleware of middlewares) {
            await new Promise<void>((resolve, reject) => {
                middleware(req, (result) => {
                    if (result instanceof Error) {
                        return reject(result);
                    }
                    resolve();
                });
            });
        }

        // Convert NextApiRequest to NextRequest
        const nextReq = req as unknown as NextRequest;

        // Call the handler and return its response
        return await handler(nextReq);
    } catch (err) {
        console.error("Error in withMiddlewares:", err);

        return new NextResponse("Error in withMiddlewares: " + (err instanceof Error ? err.message : "Unknown error"), { status: 500 });
    }
};