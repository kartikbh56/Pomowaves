import { Client, Account } from 'appwrite';

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // Replace with your Appwrite endpoint
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);   // Replace with your project ID

export const account = new Account(client);

// Function to handle Google OAuth
export const loginWithGoogle = async () => {
    try {
        const session = await account.createOAuth2Session(
            'google',
            import.meta.env.VITE_GOOGLE_SUCCESS_URL,  // Success URL (your app's URL)
            import.meta.env.VITE_GOOGLE_FAILURE_URL   // Failure URL
        );
        return session;
    } catch (error) {
        console.error('OAuth error:', error);
        throw error;
    }
};

// Function to get current session
export const getCurrentUser = async () => {
    try {
        const user = await account.get();
        return user;
    } catch (error) {
        console.error('Session error:', error);
        return null;
    }
};

// Function to logout
export const logout = async () => {
    try {
        await account.deleteSession('current');
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
};


export async function fetchGoogleProfile() {
    try {
        const { providerAccessToken } = await account.getSession('current');
        const response = await fetch(
            "https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${providerAccessToken}`, // Pass the token here
                },
            }
        );

        if (!response.ok) {
            // If the response status is not ok, throw an error with the status text
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }

        const data = await response.json();
        const profilePictureUrl = data.photos[0].url; // Extract profile picture URL
        console.log("Profile Picture URL:", profilePictureUrl);
        return profilePictureUrl;
    } catch (error) {
        console.error("Error fetching user data:", error.message);
    }
}
