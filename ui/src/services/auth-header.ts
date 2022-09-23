export default function authHeader() {
  const userJSON = localStorage.getItem("user")

  if (userJSON) {
    const user = JSON.parse(userJSON);

    if (user && user.accessToken) {
      // For Spring Boot back-end
      // return { Authorization: "Bearer " + user.accessToken };

      // for Node.js Express back-end
      return { "x-access-token": user.accessToken };
    }

  }
  return undefined
}
