import { Resend } from "resend";
import VerifyEmailTemplate from "./templates/email-verification-template";
import ResetPasswordEmailTemplate from "./templates/reset-password-template";

if (!process.env.RESEND_API_KEY) {
  throw new Error("en variable 'RESEND_API_KEY' not found");
}

const resend = new Resend();

const EMAIL_FROM = "noreply@rosnik.dev";

const sendVerification = async ({
  email,
  verificationUrl,
  userName,
}: {
  userName: string;
  email: string;
  verificationUrl: string;
}): Promise<void> => {
  void resend.emails.send({
    from: `Your App <${EMAIL_FROM}>`,
    to: [email],
    subject: "Verify your email address",
    react: (
      <VerifyEmailTemplate verificationUrl={verificationUrl} name={userName} />
    ),
  });
};

const sendResetPassword = async ({
  email,
  resetUrl,
  userName,
}: {
  userName: string;
  email: string;
  resetUrl: string;
}): Promise<void> => {
  void resend.emails.send({
    from: `Your App <${EMAIL_FROM}>`,
    to: [email],
    subject: "Reset your password",
    react: <ResetPasswordEmailTemplate name={userName} resetUrl={resetUrl} />,
  });
};

export const email = {
  sendVerification,
  sendResetPassword,
};

export default email;
