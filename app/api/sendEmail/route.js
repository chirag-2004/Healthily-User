import { Resend } from "resend";
// import { Email } from "./email";
import { NextResponse } from "next/server";
import EmailTemplate from "@/emails/my-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const response = await req.json();
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [response.data.patientEmail],
      subject: "Appointment Confirmation",
      react: EmailTemplate({ response }),
    });

    console.log("req data", req.data);
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ err });
  }
}
