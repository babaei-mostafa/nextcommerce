"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { UploadButton } from "@/lib/uploadthing";

interface Props {
  handleUploadComplete: (
    res: {
      url: string;
    }[],
  ) => void;
}

const CustomUploadButton = ({ handleUploadComplete }: Props) => {
  const handleUploadError = useCallback((error: Error) => {
    toast.error(`Error! ${error.message}`);
  }, []);
  return (
    <UploadButton
      endpoint="imageUploader"
      onClientUploadComplete={handleUploadComplete}
      onUploadError={handleUploadError}
    />
  );
};

export default CustomUploadButton;
