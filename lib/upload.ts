// lib/uploadImage.ts

import { put } from '@vercel/blob';
export const uploadImageToVercelBlob = async (image: File) => {

  const file = new File([image], image.name, { type: image.type });

  const blob = await put(file.name, file, {
    access: 'public',
  })
  console.log({blob});
  

  return blob.url 
};
