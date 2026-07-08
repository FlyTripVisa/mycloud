import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { StorageService } from "~/lib/storage";
import { FileCard } from "~/components/FileCard";

export async function loader({ context }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(context.request, {
    failureRedirect: "/login",
  });

  const storage = new StorageService(context.env.MY_BUCKET);
  const files = await storage.listFiles(user.id);

  return json({ user, files });
}

export default function Dashboard() {
  const { files } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Files</h1>
          <Form encType="multipart/form-data" method="post" action="/api/upload">
            <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 inline-block">
              Upload File
              <input type="file" name="file" className="hidden" />
            </label>
          </Form>
        </div>

        {files.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-300">No files yet</h3>
            <p className="mt-2 text-gray-500">Upload your first file to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {files.map((file) => (
              <FileCard key={file.name} file={file} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
