export async function GET() {
    const res = await fetch( "https://api.lanyard.rest/v1/users/996488031932514394" );
    const data = await res.json();
    return Response.json(data);
}