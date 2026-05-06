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

type VerifyEmailProps = {
  name?: string | null;
  verificationUrl: string;
  appName?: string;
};

export function VerifyEmailTemplate({
  name,
  verificationUrl,
  appName = "MoPo",
}: VerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address for {appName}</Preview>

      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Verify your email</Heading>

          <Text style={text}>Hi {name || "there"},</Text>

          <Text style={text}>
            Thanks for signing up for {appName}. Please confirm your email
            address by clicking the button below.
          </Text>

          <Section style={buttonWrapper}>
            <Button href={verificationUrl} style={button}>
              Verify email
            </Button>
          </Section>

          <Text style={text}>
            This link may expire soon. If you did not create an account, you can
            safely ignore this email.
          </Text>

          <Text style={footer}>
            If the button does not work, copy and paste this link into your
            browser:
            <br />
            <a href={verificationUrl} style={link}>
              {verificationUrl}
            </a>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default VerifyEmailTemplate;

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
