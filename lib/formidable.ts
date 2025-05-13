import formidable from "formidable";
import { NextRequest } from "next/server";

export const parseForm = async (req: NextRequest) => {
    const contentType = req.headers.get("content-type") || "";

    if (!contentType.includes("multipart/form-data")) {
        throw new Error("Invalid content type");
    }

    // Membaca body request sebagai stream
    const buffers = [];
    const reader = req.body?.getReader();
    if (!reader) throw new Error("No request body reader");

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffers.push(value);
    }

    const formDataBuffer = Buffer.concat(buffers);

    return new Promise<{ fields: any; files: any }>((resolve, reject) => {
        const form = formidable({ multiples: false });

        // Parse buffer data sebagai body
        form.parse(
            {
                headers: { "content-type": contentType },
                method: "POST",
                url: "",
                //@ts-ignore
                body: formDataBuffer,
            },
            (err, fields, files) => {
                if (err) reject(err);
                else resolve({ fields, files });
            }
        );
    });
};
