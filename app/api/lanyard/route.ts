export async function GET() {
    try {
        const res = await fetch("https://api.lanyard.rest/v1/users/996488031932514394", {
            headers: {
                Accept: "application/json",
            },
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            return Response.json({ error: "Upstream request failed" }, { status: 502 });
        }

        const contentType = res.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) {
            return Response.json({ error: "Upstream returned non-JSON response" }, { status: 502 });
        }

        const data = await res.json();
        return Response.json(data);
    } catch {
        return Response.json({ error: "Failed to fetch lanyard data" }, { status: 502 });
    }
}