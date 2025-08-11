"use client"

import { useState } from "react"
import { UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface ImageUploaderProps {
  onImageSelected: (imageDataOrUrl: string) => void
  currentImage?: string | null
  label?: string
  aspectRatio?: string
}

export function ImageUploader({
  onImageSelected,
  currentImage,
  label = "Upload Image",
  aspectRatio = "1:1",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()
  
  // Determine folder from label - used for virtual path organization
  const getImageFolder = () => {
    const label_lower = label.toLowerCase()
    if (label_lower.includes("sponsor")) return "sponsors"
    if (label_lower.includes("project")) return "projects"
    if (label_lower.includes("campaign")) return "campaigns"
    if (label_lower.includes("blog")) return "blog"
    if (label_lower.includes("story") || label_lower.includes("stories")) return "stories"
    if (label_lower.includes("team")) return "team"
    if (label_lower.includes("gallery")) return "gallery"
    if (label_lower.includes("author")) return "authors"
    if (label_lower.includes("avatar")) return "authors"
    return "uploads" // default folder
  }
  
  const handleImageUpload = () => {
    // Create a file input element
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const files = target.files
      
      if (!files || files.length === 0) return
      
      setIsUploading(true)
      const file = files[0]
      const reader = new FileReader()
      
      // Function to resize and compress image if needed
      const resizeAndCompressImage = (dataUrl: string, maxWidth = 800, quality = 0.7): Promise<string> => {
        return new Promise((resolve, reject) => {
          const img = document.createElement('img');
          img.onload = () => {
            // If the image is small enough, just return the original
            if (img.width <= maxWidth && dataUrl.length < 500000) {
              resolve(dataUrl);
              return;
            }
            
            // Calculate new dimensions
            const ratio = Math.min(maxWidth / img.width, 1);
            const width = Math.floor(img.width * ratio);
            const height = Math.floor(img.height * ratio);
            
            // Create canvas and resize
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
              resolve(dataUrl); // Fall back to original if canvas not supported
              return;
            }
            
            // Draw image on canvas
            ctx.drawImage(img, 0, 0, width, height);
            
            // Get data URL with compression
            const newDataUrl = canvas.toDataURL('image/jpeg', quality);
            console.log(`Resized image from ${dataUrl.length} to ${newDataUrl.length} bytes`);
            resolve(newDataUrl);
          };
          img.onerror = () => reject(new Error('Failed to load image for resizing'));
          img.src = dataUrl;
        });
      };
      
      reader.onload = async (event) => {
        try {
          const imageDataUrl = event.target?.result as string
          
          // Verify we have valid image data
          if (!imageDataUrl || typeof imageDataUrl !== 'string' || !imageDataUrl.startsWith('data:image/')) {
            console.error('Invalid image data:', imageDataUrl ? imageDataUrl.substring(0, 30) + '...' : 'undefined');
            toast({
              title: "Upload Error",
              description: "Invalid image format. Please try another image.",
              variant: "destructive",
            });
            return;
          }
          
          // Get the folder based on image type
          const folder = getImageFolder();
          
          console.log(`Processing image: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);
          console.log(`Target folder: ${folder}`);
          
          // Resize and compress the image if needed
          const processedImageData = await resizeAndCompressImage(imageDataUrl);
          
          // Convert base64 data URL to blob
          const fetchResponse = await fetch(processedImageData);
          const blob = await fetchResponse.blob();
          
          // Create FormData and append the file
          const formData = new FormData();
          formData.append('file', blob, file.name);
          formData.append('folder', folder);
          
          // Show upload in progress
          toast({
            title: "Uploading...",
            description: `Uploading "${file.name}" to server...`,
          });
          
          // Upload to server
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload`, {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Upload failed');
          }
          
          const result = await response.json();
          
          if (!result.url) {
            throw new Error('No URL returned from server');
          }
          
          console.log(`Image uploaded successfully. URL: ${result.url}`);
          
          // Pass the URL to the parent component
          onImageSelected(result.url);
          
          toast({
            title: "Upload Complete",
            description: `Image "${file.name}" has been uploaded and saved.`,
          });
        } catch (error) {
          console.error("Error uploading image:", error)
          toast({
            title: "Upload Error",
            description: "Failed to upload image to server. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsUploading(false)
        }
      }
      
      reader.onerror = () => {
        toast({
          title: "Upload Error",
          description: "Failed to read the selected file.",
          variant: "destructive",
        })
        setIsUploading(false)
      }
      
      reader.readAsDataURL(file)
    }
    
    // Trigger the file picker
    input.click()
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleImageUpload}
          className="bg-transparent"
          disabled={isUploading}
        >
          <UploadCloud className="mr-2 h-4 w-4" />
          {isUploading ? "Uploading..." : label}
        </Button>
        
        {aspectRatio && (
          <span className="text-xs text-gray-500">
            Recommended: {aspectRatio} aspect ratio
          </span>
        )}
      </div>
      
      {currentImage && (
        <div className="mt-2">
          <Image
            src={currentImage}
            alt="Preview"
            width={160}
            height={160}
            className="rounded-md border object-cover"
            unoptimized={true} // Always skip optimization since we're using data URLs
          />
        </div>
      )}
    </div>
  )
}
