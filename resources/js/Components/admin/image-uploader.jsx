import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Image as ImageIcon } from "lucide-react";

export function ImageUploader({ currentImage, onImageSelected, aspectRatio = "16:9" }) {
  const [dragActive, setDragActive] = useState(false);

  // Handle file selection
  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageSelected(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Handle file input change
  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Clear image
  const clearImage = () => {
    onImageSelected("");
  };

  // Get aspect ratio style
  const getAspectRatioStyle = () => {
    switch (aspectRatio) {
      case "1:1":
        return "aspect-square";
      case "4:3":
        return "aspect-[4/3]";
      case "16:9":
      default:
        return "aspect-video";
    }
  };

  return (
    <div className="space-y-4">
      {currentImage ? (
        <div className="relative">
          <div className={`${getAspectRatioStyle()} bg-gray-100 rounded-lg overflow-hidden`}>
            <img
              src={currentImage}
              alt="Selected image"
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2"
            onClick={clearImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div
          className={`${getAspectRatioStyle()} border-2 border-dashed ${
            dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
          } rounded-lg transition-colors duration-200`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="h-full flex flex-col items-center justify-center p-4 text-center">
            <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Drag & drop an image here, or click to select
            </p>
            <Input
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
              id="image-upload"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('image-upload').click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Select Image
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
