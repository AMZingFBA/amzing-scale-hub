import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface VerificationEmailProps {
  verificationCode: string;
  firstName: string;
}

export const VerificationEmail = ({
  verificationCode,
  firstName,
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Vérifiez votre compte AMZing FBA Affiliate</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Bienvenue sur AMZing FBA Affiliate ! 🎉</Heading>
        
        <Text style={text}>
          Bonjour {firstName},
        </Text>
        
        <Text style={text}>
          Merci de vous être inscrit au programme d'affiliation AMZing FBA. 
          Pour activer votre compte, veuillez utiliser le code de vérification ci-dessous :
        </Text>
        
        <Section style={codeContainer}>
          <Text style={code}>{verificationCode}</Text>
        </Section>
        
        <Text style={text}>
          Ce code est valable pendant <strong>10 minutes</strong>.
        </Text>
        
        <Text style={text}>
          Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email en toute sécurité.
        </Text>
        
        <Text style={footer}>
          Cordialement,<br />
          L'équipe AMZing FBA
        </Text>
      </Container>
    </Body>
  </Html>
)

export default VerificationEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 40px',
  textAlign: 'center' as const,
}

const text = {
  color: '#525252',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
  padding: '0 40px',
}

const codeContainer = {
  background: '#f4f4f4',
  borderRadius: '8px',
  margin: '32px 40px',
  padding: '24px',
  textAlign: 'center' as const,
}

const code = {
  color: '#000000',
  fontSize: '48px',
  fontWeight: 'bold',
  letterSpacing: '8px',
  lineHeight: '1',
  margin: '0',
  fontFamily: 'monospace',
}

const footer = {
  color: '#898989',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '48px 0 0 0',
  padding: '0 40px',
}
