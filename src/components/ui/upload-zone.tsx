import { useState, useCallback } from "react";
import { Upload, Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UploadZoneProps {
  onImageUpload: (file: File) => void;
}

const UploadZone = ({ onImageUpload }: UploadZoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileUpload(imageFile);
    } else {
      toast.error("Please upload an image file");
    }
  }, []);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    onImageUpload(file);
    toast.success("Image uploaded successfully!");
  };

  const clearImage = () => {
    setPreviewImage(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {previewImage ? (
        <div className="relative group">
          <div className="relative rounded-2xl overflow-hidden border-2 border-border">
            <img
              src={previewImage}
              alt="Uploaded preview"
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          <Button
            onClick={clearImage}
            variant="destructive"
            size="sm"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer hover-lift
            ${isDragOver 
              ? 'border-primary bg-primary/5 scale-105' 
              : 'border-border hover:border-primary/50 hover:bg-primary/2'
            }
          `}
        >
          <div className="flex flex-col items-center gap-6">
            <div className={`
              w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300
              ${isDragOver 
                ? 'bg-gradient-to-br from-primary to-accent text-white scale-110' 
                : 'bg-secondary text-primary'
              }
            `}>
              {isDragOver ? (
                <Upload className="w-8 h-8 animate-bounce" />
              ) : (
                <Image className="w-8 h-8" />
              )}
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-2 text-foreground">
                {isDragOver ? 'Drop your image here' : 'Upload Your Photo'}
              </h3>
              <p className="text-muted-foreground mb-6">
                Drag and drop your image here, or click to browse
              </p>
              
              <Button
                onClick={() => document.getElementById('file-input')?.click()}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary-light hover:to-accent-light text-white"
                size="lg"
              >
                Choose File
              </Button>
            </div>
          </div>
          
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};

export default UploadZone;