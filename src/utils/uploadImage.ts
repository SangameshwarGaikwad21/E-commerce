import cloudinary from "@/utils/cloudinary";
import {
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";

export async function uploadImageToCloudinary(
  file: File
): Promise<UploadApiResponse> {
  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result: UploadApiResponse = await new Promise(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "products",
            resource_type: "image",
          },
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined
          ) => {
            if (error) reject(error);
            else resolve(result as UploadApiResponse);
          }
        )
        .end(buffer);
    }
  );

  return result;
}