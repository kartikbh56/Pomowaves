import { account } from "./appwrite";

// Function to handle Google OAuth
export async function loginWithGoogle() {
  const baseUrl = window.location.origin;

  // Instead of createOAuth2Session, use createOAuth2Token
  account.createOAuth2Token(
    "google", // or any other provider
    `${baseUrl}/auth/callback`, // your callback URL
    `${baseUrl}/auth`, // failure URL
  );
}

export const handleCallback = async (userId, secret) => {
  try {
    // Create a session using the OAuth2 token
    await account.createSession(userId, secret);

    // Get the user data
    const user = await account.get();

    // User is now authenticated!
    return user;
  } catch (error) {
    console.error("Authentication failed:", error);
    throw error;
  }
};

export async function testUserLogin() {
  await account.createEmailPasswordSession("test@example.com", "test@123");
}

// Function to get current session
export const getCurrentUser = async () => {
  const user = await account.get();
  return user;
};

// Function to logout
export const logout = async () => {
  await account.deleteSession("current");
};
