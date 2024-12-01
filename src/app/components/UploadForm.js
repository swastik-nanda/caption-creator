'use client';
import axios from 'axios';
import UploadIcon from './UploadIcon';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadForm() {
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  async function upload(event) {
    event.preventDefault();

    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];

      // Validate file type and size
      if (!['video/mp4', 'video/mov'].includes(file.type)) {
        alert('Only MP4 or MOV files are allowed');
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        alert('File size should be less than 50MB');
        return;
      }

      const formData = new FormData();
      setIsUploading(true);
      formData.append('file', file);

      try {
        const res = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setIsUploading(false);

        if (res.status === 200) {
          const newName = res.data.newName;
          router.push('/' + newName);
        } else {
          console.error('Unexpected response:', res);
        }
      } catch (error) {
        setIsUploading(false);
        console.error(
          'Error uploading file:',
          error.response || error.message
        );
      }
    }
  }

  return (
    <>
      {isUploading && (
        <div className="bg-black/90 text-white fixed inset-0 flex items-center">
          <div className="w-full text-center">
            <h2 className="text-4xl mb-4">Uploading</h2>
            <h3 className="text-xl">Please Wait...</h3>
          </div>
        </div>
      )}
      <label className="bg-green-600 border-2 border-purple-700/50 py-2 px-6 rounded-full inline-flex gap-2 cursor-pointer">
        <UploadIcon />
        <span>Choose file</span>
        <input
          type="file"
          className="hidden cursor-pointer"
          onChange={upload}
        />
      </label>
    </>
  );
}
