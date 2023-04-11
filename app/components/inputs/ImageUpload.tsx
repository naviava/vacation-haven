"use client";

// React and Next.
import { useCallback } from "react";
import Image from "next/image";

// External packages.
import { CldUploadWidget } from "next-cloudinary";
import { TbPhotoPlus } from "react-icons/tb";

// import { v2 as cloudinary } from "cloudinary";

declare global {
  var cloudinary: any;
}

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

let prevImage: string | null;

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange }) => {
  const handleUpload = useCallback(
    (result: any) => {
      //   if (prevImage) {
      //     cloudinary.uploader.destroy(prevImage).then((result) => {
      //       console.log(result);
      //     });
      //   }
      //   prevImage = result.info.secure_url;
      onChange(result.info.secure_url);
    },
    [onChange]
  );

  return (
    <CldUploadWidget
      onUpload={handleUpload}
      uploadPreset="ocpzby2e"
      options={{ maxFiles: 1 }}
    >
      {({ open }) => {
        return (
          <div
            onClick={() => open?.()}
            className="flex-flex-col relative cursor-pointer items-center justify-center gap-4 border-2 border-dashed border-neutral-300 p-20 text-neutral-600 transition hover:opacity-70"
          >
            <TbPhotoPlus size={50} />
            <div className="text-lg font-semibold">Click to upload</div>
            {value && (
              <div className="absolute inset-0 h-full w-full">
                <Image
                  src={value}
                  alt="upload"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
};
export default ImageUpload;
