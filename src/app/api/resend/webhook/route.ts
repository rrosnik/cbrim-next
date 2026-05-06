import { NextRequest, NextResponse } from "next/server";
import { EmailDeliveredEvent, EmailSentEvent } from "resend";

export const POST = async (req: NextRequest) => {
	if (req.method === "POST") {
		const body = await req.json();
		console.log("Webhook from Resend", { body });
		const event = body.event as EmailSentEvent | EmailDeliveredEvent | null;
		if (!event) {
			return NextResponse.json({ error: "Bad request" }, { status: 400 });
		}
		if (event.type === "email.sent") {
			return NextResponse.json(null, { status: 200 });
		} else if (event.type === "email.delivered") {
			return NextResponse.json(null, { status: 200 });
		}

		return NextResponse.json({}, { status: 200 });
	}
};
