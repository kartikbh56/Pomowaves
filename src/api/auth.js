import { account } from "./appwrite";

// Function to handle Google OAuth
export async function loginWithGoogle() {
  const session = await account.createOAuth2Session(
    "google",
    import.meta.env.VITE_GOOGLE_SUCCESS_URL, // Success URL (your app's URL)
    import.meta.env.VITE_GOOGLE_FAILURE_URL // Failure URL
  );
  return session;
}

export async function testUserLogin() {
  const session = await account.createEmailPasswordSession(
    "test@example.com",
    "test@123"
  );
  return session;
}

// Function to get current session
export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    console.error("Session error:", error);
    return null;
  }
};

// Function to logout
export const logout = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};
