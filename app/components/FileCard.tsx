import type { FileMetadata } from "~/lib/storage";
import { useState } from "react";
import { Form } from "@remix-run/react";

interface FileCardProps {
  file: FileMetadata;
}

export function FileCard({ file }: FileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(file.name);

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext || '')) {
      return '🖼️';
    } else if (['mp4', 'avi', 'mov', 'wmv'].includes(ext || '')) {
      return '🎬';
    } else if (['mp3', 'wav', 'ogg'].includes(ext || '')) {
      return '🎵';
    } else if (['pdf'].includes(ext || '')) {
      return '📄';
    } else if (['doc', 'docx'].includes(ext || '')) {
      return '📝';
    } else if (['zip', 'rar', '7z'].includes(ext || '')) {
      return '📦';
    }
    return '📁';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="text-2xl">{getFileIcon(file.name)}</div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="text-blue-400 hover:text-blue-300"
          >
            ✏️
          </button>
          <Form method="post" action={`/api/files/${encodeURIComponent(file.name)}`}>
            <input type="hidden" name="_method" value="delete" />
            <button 
              type="submit"
              className="text-red-400 hover:text-red-300"
            >
              🗑️
            </button>
          </Form>
        </div>
      </div>

      {isEditing ? (
        <Form method="post" action={`/api/files/${encodeURIComponent(file.name)}`}>
          <input type="hidden" name="_method" value="rename" />
          <input
            type="text"
            name="newName"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-2 py-1 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <div className="flex space-x-2">
            <button
              type="submit"
              className="text-green-400 hover:text-green-300"
            >
              ✓
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setNewName(file.name);
              }}
              className="text-red-400 hover:text-red-300"
            >
              ✕
            </button>
          </div>
        </Form>
      ) : (
        <h3 className="font-medium text-white truncate">{file.name}</h3>
      )}

      <div className="text-sm text-gray-400 mt-2">
        <p>{formatFileSize(file.size)}</p>
        <p>{new Date(file.uploadedAt).toLocaleDateString()}</p>
      </div>

      <div className="mt-4">
        <Form method="post" action={`/api/share/${encodeURIComponent(file.name)}`}>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-1 px-2 rounded text-sm"
          >
            Share Link
          </button>
        </Form>
      </div>
    </div>
  );
}
