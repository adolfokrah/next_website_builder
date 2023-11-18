export async function GET(req: Request) {
   let cookie = req.headers.getSetCookie();
   console.log(cookie);
}