import { redirect, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { Form, Link, useActionData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("_intent");

  if (intent === "logout") {
    return await authenticator.logout(request, { redirectTo: "/" });
  }

  return null;
}

export default function Index() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
          Cloud File Manager
        </h1>
        <p className="mt-6 text-xl text-gray-300">
          Secure, fast, and easy file management with Cloudflare R2
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/login"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
          >
            Login to Dashboard
          </Link>
          <Link
            to="/signup"
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-16 bg-gray-800 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white">Secure Storage</h3>
              <p className="text-gray-300 mt-2">Enterprise-grade security with Cloudflare R2</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white">Easy Sharing</h3>
              <p className="text-gray-300 mt-2">Generate secure shareable links instantly</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white">Mobile Friendly</h3>
              <p className="text-gray-300 mt-2">Works perfectly on all devices</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
