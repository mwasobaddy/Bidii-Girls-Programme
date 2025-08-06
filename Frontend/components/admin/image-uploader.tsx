"use client"

import { useState } from "react"
import { UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface ImageUploaderProps {
  onImageSelected: (imageDataUrl: string) => void
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
      
      reader.onload = (event) => {
        const imageDataUrl = event.target?.result as string
        
        // Store in localStorage with a unique key for persistence
        const imageKey = `admin_image_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`
          
        try {
          localStorage.setItem(imageKey, imageDataUrl)
          onImageSelected(imageDataUrl)
          
          toast({
            title: "Image Uploaded",
            description: `Image "${file.name}" has been uploaded and stored locally.`,
          })
        } catch (error) {
          console.error("Error storing image in localStorage:", error)
          toast({
            title: "Upload Error",
            description: "Failed to store image. File may be too large.",
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
          />
        </div>
      )}
    </div>
  )
}
