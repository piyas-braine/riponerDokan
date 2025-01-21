/* eslint-disable @typescript-eslint/no-explicit-any */
import upload from "@/utils/multer";
import { NextRequest } from "next/server";
import { Readable } from "stream";

const multerMiddleware = async (
    req: NextRequest & { files?: any; formData?: any },
    next: (err?: unknown | Error) => void
) => {
    const multerPromise = new Promise<void>((resolve, reject) => {
        // Choose the multer middleware based on type
        const middleware = upload.array("files", 5); // For multiple file uploads (limit to 5 files)

        // Convert the NextRequest body to a readable stream
        const bodyStream = Readable.from(req.body as unknown as AsyncIterable<Uint8Array>);

        // Mock Express-like request
        const mockReq: any = Object.assign(bodyStream, {
            headers: Object.fromEntries(req.headers.entries()),
            pipe: bodyStream.pipe.bind(bodyStream),
            unpipe: bodyStream.unpipe?.bind(bodyStream),
            on: bodyStream.on.bind(bodyStream),
            off: bodyStream.off?.bind(bodyStream),
            complete: false, // Simulate request completion flag for Multer
        });

        const mockRes: any = {
            end: () => {}, // Stub response method
        };

        middleware(mockReq, mockRes, (err: unknown) => {
            if (err) {
                reject(err);
            } else {
                // Attach files and form data to the custom properties
                req.files = mockReq.files; // Multiple file data
                req.formData = mockReq.body; // Text fields (attached to `req.formData`)
                resolve();
            }
        });
    });

    try {
        await multerPromise;
        next();
    } catch (err) {
        next(err);
    }
};

export default multerMiddleware;
