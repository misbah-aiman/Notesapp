function withValidProperties(properties: Record<string, undefined | string | string[]>) {
return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => (Array.isArray(value) ? value.length > 0 : !!value))
);
}

export async function GET() {
const URL = process.env.NEXT_PUBLIC_URL as string;
return Response.json({
  "accountAssociation": {
    "header": "",
    "payload": "",
    "signature": ""
  },
  "baseBuilder": {
    "ownerAddress": "0x9491af0e35D1b5816a5e7f5e3C75Cd45af1eBBE9"
  },
  "miniapp": {
    "version": "1",
    "name": "Notes App",
    "homeUrl": "https://notesapp-red-eta.vercel.app/",
    "iconUrl": "https://notesapp-red-eta.vercel.app/icon.png",
    "splashImageUrl": "https://notesapp-red-eta.vercel.app/splash.png",
    "splashBackgroundColor": "#000000",
    "webhookUrl": "https://notesapp-red-eta.vercel.app/api/webhook",
    "subtitle": "Simple, social note-taking",
    "description": "A fast and simple way to take notes and share with friends on Farcaster."
  }
});
}
