// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import { authOptions } from "../../../lib/auth";

export default function auth(req, res) {
  return NextAuth(req, res, authOptions);
}
