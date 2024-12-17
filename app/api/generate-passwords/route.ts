import { randomBytes } from "crypto";

const generatePassword = (length: number = 12): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  const randomValues = randomBytes(length);

  for (let i = 0; i < length; i++) {
    password += chars[randomValues[i] % chars.length];
  }

  return password;
};

const generateUniquePasswords = (
  numOfPass: number,
  length: number
): string[] => {
  const passwords = new Set<string>();

  while (passwords.size < numOfPass) {
    passwords.add(generatePassword(length));
  }

  return Array.from(passwords);
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const numOfPass = url.searchParams.get("numOfPass") || "10";
    const length = url.searchParams.get("length") || "12";

    console.log(numOfPass, length, "hello");

    const numPasswords = Math.min(Number(numOfPass), 100000); // Cap the number of passwords at 100,000
    const passwordLength = Math.max(8, Math.min(Number(length), 50)); // Enforce password length between 8 and 50

    // Validate the query parameters
    if (isNaN(numPasswords) || isNaN(passwordLength)) {
      return new Response(
        JSON.stringify({ error: "Invalid query parameters" }),
        { status: 400 }
      );
    }

    const passwords = generateUniquePasswords(numPasswords, passwordLength);

    return new Response(JSON.stringify({ passwords }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating passwords:", error);

    return new Response(
      JSON.stringify({ error: "Failed to generate passwords" }),
      { status: 500 }
    );
  }
}
