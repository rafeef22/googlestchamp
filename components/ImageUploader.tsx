
import React, { useCallback } from 'react';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  multiple?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onImagesChange, multiple = true }) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const filesArray = Array.from(files);
    if (filesArray.length === 0) return;

    const newBase64Images: string[] = [];
    let filesProcessed = 0;

    filesArray.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        newBase64Images.push(base64String);
        
        filesProcessed++;
        if (filesProcessed === filesArray.length) {
          if (multiple) {
            onImagesChange([...images, ...newBase64Images]);
          } else {
            onImagesChange(newBase64Images); // Replace with new images for single upload
          }
        }
      };
      reader.readAsDataURL(file);
    });
  }, [images, onImagesChange, multiple]);

  const removeImage = (indexToRemove: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    onImagesChange(updatedImages);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-brand-secondary">Product Images</label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-brand-border border-dashed rounded-md">
        <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          <div className="flex text-sm text-gray-500">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-brand-surface rounded-md font-medium text-brand-accent hover:text-yellow-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-brand-surface focus-within:ring-brand-accent"
            >
              <span>{multiple ? 'Upload files' : 'Upload file'}</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple={multiple} onChange={handleFileChange} accept="image/*" />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
      {images.length > 0 && multiple && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {images.map((src, index) => (
            <div key={index} className="relative group">
              <img src={src} alt={`Preview ${index}`} className="h-24 w-24 object-cover rounded-md border border-brand-border" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center h-6 w-6"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;