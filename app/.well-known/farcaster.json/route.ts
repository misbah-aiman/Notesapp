function withValidProperties(properties: Record<string, undefined | string | string[]>) {
return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => (Array.isArray(value) ? value.length > 0 : !!value))
);
}

export async function GET() {
const URL = process.env.NEXT_PUBLIC_URL as string;
return Response.json({
  "accountAssociation": {
    "header": "eyJmaWQiOjE0NzMxNzIsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg5NGQ3Njk0NzQ5N2QzZTcxZUU1NDM4OTBGRjBjOEM0MkM3RmI3NDIzIn0",
    "payload": "eyJkb21haW4iOiJub3Rlc2FwcC1yZWQtZXRhLnZlcmNlbC5hcHAifQ",
    "signature": "g93QgfAVz7GMsRtldjPepRGgF8h16q7DH6m8wHSzIastavhtivziqE9O0F6kUTkyukO02xu71OgJ7TxV+aBneRs="
  },
  "frame": {
    "version": "1",
    "name": "Notes App",
    "iconUrl": "https://notesapp-red-eta.vercel.app/icon.png",
    "homeUrl": "https://notesapp-red-eta.vercel.app",
    "imageUrl": "https://notesapp-red-eta.vercel.app/image.png",
    "buttonTitle": "Check this out",
    "splashImageUrl": "https://notesapp-red-eta.vercel.app/splash.png",
    "splashBackgroundColor": "#eeccff",
    "webhookUrl": "https://notesapp-red-eta.vercel.app/api/webhook"
  }
});
}
