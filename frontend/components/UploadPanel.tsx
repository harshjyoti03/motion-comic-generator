"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";

interface OCRText {
  text: string;
  confidence: number;
}

interface OCRResult {
  filename: string;
  ocr_text: OCRText[];
}

export default function UploadPanel() {

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [ocrResults, setOcrResults] = useState<OCRResult[]>([]);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const updatedImages = [...selectedImages, ...files];

    setSelectedImages(updatedImages);

    const imagePreviews = updatedImages.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviews(imagePreviews);
  };

  const removeImage = (index: number) => {

    const updatedImages = selectedImages.filter(
      (_, i) => i !== index
    );

    setSelectedImages(updatedImages);

    const updatedPreviews = updatedImages.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviews(updatedPreviews);
  };

  const uploadImages = async () => {

    if (!selectedImages.length) {
      alert("Please select images first");
      return;
    }

    setLoading(true);

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

      setOcrResults(data.results || []);

      alert("OCR extraction completed!");

    } catch (error) {

      console.error(error);

      alert("Upload failed");

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl flex flex-col items-center gap-8">

      {/* Upload Area */}
      <label className="w-full border-2 border-dashed border-gray-700 rounded-3xl p-16 flex flex-col items-center justify-center cursor-pointer hover:border-white transition">

        <Upload size={60} className="mb-4 text-gray-400" />

        <h2 className="text-2xl font-semibold mb-2">
          Upload Comic Panels
        </h2>

        <p className="text-gray-400 mb-4">
          Click to browse images
        </p>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="hidden"
        />

      </label>

      {/* Image Grid */}
      {previews.length > 0 && (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">

          {previews.map((preview, index) => (

            <div
              key={index}
              className="bg-zinc-900 rounded-3xl p-4 border border-gray-800"
            >

              <div className="relative group">

                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="rounded-2xl object-cover w-full"
                />

                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-black/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={18} />
                </button>

              </div>

              {/* OCR Results */}
              {ocrResults[index] && (

                <div className="mt-6">

                  <h3 className="font-bold text-lg mb-3">
                    Extracted Text
                  </h3>

                  <div className="space-y-3">

                    {ocrResults[index].ocr_text.map((item, i) => (

                      <div
                        key={i}
                        className="bg-black/40 rounded-xl p-3"
                      >

                        <p className="text-white">
                          {item.text}
                        </p>

                        <p className="text-sm text-gray-400 mt-1">
                          Confidence: {(item.confidence * 100).toFixed(1)}%
                        </p>

                      </div>

                    ))}

                  </div>

                </div>

              )}

            </div>

          ))}

        </div>

      )}

      <button
        onClick={uploadImages}
        disabled={loading}
        className="bg-white text-black px-8 py-4 rounded-2xl font-bold text-lg hover:opacity-80 transition disabled:opacity-50"
      >

        {loading ? "Extracting..." : "Extract Dialogue"}

      </button>

    </div>
  );
}