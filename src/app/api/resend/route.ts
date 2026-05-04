// import { resend } from "@/lib/email";
// import { EmailTemplate } from "@/modules/email/templates/sample";

export async function POST() {
	try {
		// const { data, error } = await resend.emails.send({
		// 	from: "Acme <onboarding@rosnik.dev>",
		// 	to: ["rezarostaminikoo@gmail.com"],
		// 	subject: "Hello world",
		// 	react: EmailTemplate({ firstName: "John" }),
		// });
		// if (error) {
		// 	return Response.json({ error }, { status: 500 });
		// }
		// return Response.json(data);
	} catch (error) {
		return Response.json({ error }, { status: 500 });
	}
}
