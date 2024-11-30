'use client';
import axios from 'axios';
import UploadIcon from './UploadIcon';
import { useState } from 'react';

export default function UploadForm() {
  const [isUploading, setIsUploading] = useState(false);
  async function upload(event) {
    event.preventDefault();

    const files = event.target.files;
    if (files.length > 0) {
      const formData = new FormData();
      setIsUploading((t) => true);
      formData.append('file', files[0]);

      try {
        // Send the file to the server to be uploaded
        const res = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setIsUploading((t) => false);
        console.log('Response:', res.data); // Log the response from the server
      } catch (error) {
        console.error('Error uploading file:', error);
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
