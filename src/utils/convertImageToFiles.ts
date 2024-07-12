import React from 'react';
import { NewNoteForm } from '@models/post';
import { CroppedImg } from '@utils/getCroppedImg';

type SetNoteInfo = React.Dispatch<React.SetStateAction<NewNoteForm>>;

export const urlToFile = async (url: string, filename: string, mimeType: string): Promise<File> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: mimeType });
};

export const convertImagesToFiles = async (images: string[], setNoteInfo: SetNoteInfo) => {
  const filePromises = images.map(async (image: string, index: number) => {
    const file = await urlToFile(image, `image${index}.jpg`, 'image/jpeg');
    const url = URL.createObjectURL(file);
    return { file, url } as CroppedImg;
  });

  const fileObjects = await Promise.all(filePromises);
  setNoteInfo((prevNoteInfo) => ({
    ...prevNoteInfo,
    images: fileObjects,
  }));
};
