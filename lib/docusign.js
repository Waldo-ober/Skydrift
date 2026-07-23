/**
 * DocuSign integration.
 *
 * MOCK_MODE (default while credentials are unset): simulates DocuSign's
 * responses locally, with an in-memory delay, so the full signing flow
 * can be demoed and tested with zero real DocuSign calls, zero cost,
 * and no risk to Kim's live account.
 *
 * Real mode: uses DocuSign's eSignature REST API with JWT auth against
 * the Integration Key + template created in Kim's account. Swap in real
 * values in .env.local and set MOCK_MODE=false to go live.
 */

const isMock = () =>
  process.env.MOCK_MODE === 'true' || !process.env.DOCUSIGN_INTEGRATION_KEY;

/**
 * Creates (sends) an envelope from the pre-built NDA template, pre-filled
 * with the visitor's name/email, and returns an embedded signing URL.
 */
export async function createEnvelope({ name, email, phone }) {
  if (isMock()) {
    // Simulate network latency + a fake envelope/session id.
    await new Promise((r) => setTimeout(r, 600));
    const mockEnvelopeId = `mock-envelope-${Date.now()}`;
    return {
      envelopeId: mockEnvelopeId,
      // In mock mode we send them to our own fake signing page instead
      // of DocuSign's real signing ceremony.
      signingUrl: `/access/sign?envelopeId=${mockEnvelopeId}&name=${encodeURIComponent(
        name
      )}&email=${encodeURIComponent(email)}`,
    };
  }

  // ---- REAL MODE ----
  // Requires: DOCUSIGN_INTEGRATION_KEY, DOCUSIGN_USER_ID, DOCUSIGN_ACCOUNT_ID,
  // DOCUSIGN_PRIVATE_KEY, DOCUSIGN_TEMPLATE_ID, DOCUSIGN_BASE_URL set.
  const accessToken = await getJwtAccessToken();

  const envelopeDefinition = {
    templateId: process.env.DOCUSIGN_TEMPLATE_ID,
    templateRoles: [
      {
        roleName: 'Signer',
        name,
        email,
        clientUserId: email, // required for embedded signing
      },
    ],
    status: 'sent',
  };

  const createRes = await fetch(
    `${process.env.DOCUSIGN_BASE_URL}/v2.1/accounts/${process.env.DOCUSIGN_ACCOUNT_ID}/envelopes`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(envelopeDefinition),
    }
  );
  const envelope = await createRes.json();

  const viewRes = await fetch(
    `${process.env.DOCUSIGN_BASE_URL}/v2.1/accounts/${process.env.DOCUSIGN_ACCOUNT_ID}/envelopes/${envelope.envelopeId}/views/recipient`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/docusign/return`,
        authenticationMethod: 'none',
        email,
        userName: name,
        clientUserId: email,
      }),
    }
  );
  const view = await viewRes.json();

  return { envelopeId: envelope.envelopeId, signingUrl: view.url };
}

async function getJwtAccessToken() {
  // Real implementation would use the docusign-esign SDK's JWT grant flow
  // with DOCUSIGN_PRIVATE_KEY. Left as a stub — wire this up once Kim's
  // Integration Key + RSA keypair are generated in DocuSign Admin.
  throw new Error(
    'getJwtAccessToken() not implemented — add DocuSign JWT auth before disabling MOCK_MODE'
  );
}

/**
 * Verifies an incoming DocuSign Connect webhook payload.
 * In mock mode, always returns valid (since we generate the fake events ourselves).
 */
export function verifyWebhookSignature(payload, signatureHeader) {
  if (isMock()) return true;

  // Real mode: validate DOCUSIGN_WEBHOOK_SECRET (HMAC) here before trusting
  // the payload. Never process an unverified webhook in production.
  // See: https://developers.docusign.com/platform/webhooks/connect/
  return false; // fail closed until real verification is implemented
}
