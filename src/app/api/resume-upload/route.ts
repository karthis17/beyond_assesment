// app/api/resume-upload/route.ts
import { NextRequest } from "next/server";
import FormData from "form-data";
import axios from "axios";

export async function POST(req: NextRequest) {
    const body = await req.arrayBuffer();
    const buffer = Buffer.from(body);
    const fileName = req.headers.get("x-filename") || "resume.pdf";

    const formData = new FormData();
    formData.append("file", buffer, fileName);
    formData.append("wait", "true");

    try {
        const response = await axios.post("https://api.affinda.com/v2/documents", formData, {
            headers: {
                Authorization: `Bearer ${process.env.AFFINDA_API_KEY}`,
                ...formData.getHeaders(),
            },
        });

        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err: any) {
        console.error("Error uploading to Affinda:", err.message);
        return new Response(JSON.stringify({ error: "Upload failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
