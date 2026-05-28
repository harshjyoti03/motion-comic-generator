"use client";

import { useState } from "react";

export default function UploadPanel() {

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    setSelectedImages(files);

    const imagePreviews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviews(imagePreviews);
  };

  const uploadImages = async () => {

    if (!selectedImages.length) {
      alert("Please select images first");
      return;
    }

    const formData = new FormData();

    selectedImages.forEach((image) => {
      formData.append("files", image);
    });

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log(data);

      alert("Panels uploaded successfully!");

    } catch (error) {

      console.error(error);

      alert("Upload failed");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="text-white"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

        {previews.map((preview, index) => (
          <img
            key={index}
            src={preview}
            alt={`Preview ${index}`}
            className="w-48 rounded-xl border border-gray-700"
          />
        ))}

      </div>

      <button
        onClick={uploadImages}
        className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:opacity-80"
      >
        Upload Panels
      </button>

    </div>
  );
}