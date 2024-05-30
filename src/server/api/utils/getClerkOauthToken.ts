import axios from "axios";

export const getClerkUserToken = async ({ userID }: { userID: string }) =>
  await axios
    .get(
      `https://api.clerk.dev/v1/users/${userID}/oauth_access_tokens/oauth_google`,
      {
        headers: {
          Authorization:
            "Bearer sk_test_faqhX8zo1pU303DllxahDOkoWBPQ60b6wHHl9OlLX4",
        },
      },
    )
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    .then((res) => res.data[0].token as string);
