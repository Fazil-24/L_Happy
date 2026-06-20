import fs from "node:fs";
import https from "node:https";
import Cerebras from "@cerebras/cerebras_cloud_sdk";

function readCertificateAuthority(): string | undefined {
  const inlineValue =
    process.env.CEREBRAS_CA_CERT?.trim() || process.env.CEREBRAS_CA_CERTS?.trim();
  if (inlineValue) return inlineValue;

  const certPath =
    process.env.CEREBRAS_CA_CERT_PATH?.trim() ||
    process.env.CEREBRAS_CA_CERT_FILE?.trim() ||
    process.env.NODE_EXTRA_CA_CERTS?.trim();

  if (!certPath) return undefined;

  try {
    const certificate = fs.readFileSync(certPath, "utf8").trim();
    return certificate || undefined;
  } catch {
    return undefined;
  }
}

function createHttpAgent() {
  const certificateAuthority = readCertificateAuthority();
  if (!certificateAuthority) return undefined;

  return new https.Agent({
    ca: certificateAuthority,
  });
}

export function getCerebrasClient() {
  return new Cerebras({
    apiKey: process.env.CEREBRAS_API_KEY,
    httpAgent: createHttpAgent(),
  });
}
