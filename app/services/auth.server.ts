import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { createCookieSessionStorage } from "@remix-run/cloudflare";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["s3cr3t"],
    secure: true,
  },
});

export const authenticator = new Authenticator(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email");
    const password = form.get("password");

    // In a real app, validate against your D1 database
    // For demo purposes, accept any non-empty credentials
    if (typeof email !== "string" || typeof password !== "string") {
      throw new Error("Invalid form data");
    }

    // Mock user validation
    if (email && password) {
      return { email, id: "1" };
    }

    throw new Error("Invalid credentials");
  }),
  "user-pass"
);
