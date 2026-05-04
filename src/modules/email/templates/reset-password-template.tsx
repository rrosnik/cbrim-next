import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "react-email";

type ResetPasswordEmailProps = {
  name?: string | null;
  resetUrl: string;
  appName?: string;
};

export function ResetPasswordEmailTemplate({
  name,
  resetUrl,
  appName = "MoPo",
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password for {appName}</Preview>

      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Reset your password</Heading>

          <Text style={text}>Hi {name || "there"},</Text>

          <Text style={text}>
            We received a request to reset the password for your {appName}
            account. Click the button below to choose a new password.
          </Text>

          <Section style={buttonWrapper}>
            <Button href={resetUrl} style={button}>
              Reset password
            </Button>
          </Section>

          <Text style={text}>
            This link will expire soon. If you did not request a password reset,
            you can safely ignore this email.
          </Text>

          <Text style={footer}>
            If the button does not work, copy and paste this link into your
            browser:
            <br />
            <a href={resetUrl} style={link}>
              {resetUrl}
            </a>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ResetPasswordEmailTemplate;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px",
  borderRadius: "12px",
  maxWidth: "560px",
};

const heading = {
  fontSize: "24px",
  lineHeight: "32px",
  fontWeight: "700",
  color: "#111827",
};

const text = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#374151",
};

const buttonWrapper = {
  margin: "32px 0",
};

const button = {
  backgroundColor: "#111827",
  color: "#ffffff",
  padding: "12px 20px",
  borderRadius: "8px",
  textDecoration: "none",
  fontSize: "16px",
  fontWeight: "600",
};

const footer = {
  fontSize: "13px",
  lineHeight: "20px",
  color: "#6b7280",
};

const link = {
  color: "#2563eb",
  wordBreak: "break-all" as const,
};
