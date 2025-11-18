import { NextResponse } from 'next/server'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_URL ?? '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

export async function ALL(request: Request) {
  try {
    const headers: Record<string, string | null> = {}
    request.headers.forEach((value, key) => {
      headers[key] = value
    })

    let body: any = null
    try {
      body = await request.json()
    } catch {
      // not JSON or empty
      body = null
    }

    const payload = {
      method: request.method,
      url: request.url,
      headers,
      body,
    }

    return NextResponse.json({ success: true, data: payload }, { headers: CORS_HEADERS })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: CORS_HEADERS })
  }
}
