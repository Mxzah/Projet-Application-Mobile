const BASE_URL = "http://martha.jh.shawinigan.info/queries";
const AUTH_TOKEN = "dGVhbTY6NzdDYzNjMzMwNDAyMzgxZSExNmFhOWE0OTUyOA==";

export async function executeQuery(queryPath, body = null) {
  const url = `${BASE_URL}/${queryPath}`;
  const options = {
    method: "POST",
    headers: {
      auth: AUTH_TOKEN,
      "Content-Type": "application/json",
    },
  };

  if (body !== null) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  return response.json();
}
