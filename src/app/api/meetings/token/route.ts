import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { AccessToken } from "livekit-server-sdk";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { roomName, participantName } = await req.json();

  if (!roomName) return NextResponse.json({ error: "roomName required" }, { status: 400 });

  const apiKey = process.env.LIVEKIT_API_KEY!;
  const apiSecret = process.env.LIVEKIT_API_SECRET!;

  const at = new AccessToken(apiKey, apiSecret, {
    identity: session.user.id,
    name: participantName || session.user.name || "Developer",
    ttl: "2h",
  });

  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  const token = await at.toJwt();
  return NextResponse.json({ token });
}
