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
  "frame": {
    "version": "1",
    "name": "Notes App", 
    
    "homeUrl": "https://notesapp-red-eta.vercel.app/", 

    "splashBackgroundColor": "#ffffff",
    "webhookUrl": "https://yourdomain.com/api/webhook"
  }
    });
}
