import { PaginationResponse } from '@models/api/common';
import { Comment, Like, Note } from '@models/post';
import axios, { axiosFormDataInstance } from '@utils/apis/axios';
import { objectFormDataSerializer } from '@utils/validateHelpers';

export const getNoteList = async (page: string | null) => {
  const requestPage = page ? page.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<Note[]>>(
    `/notes/${!requestPage ? '' : `?page=${requestPage}`}`,
  );
  return data;
};

export const getNoteDetail = async (noteId: number) => {
  const { data } = await axios.get<Note>(`/notes/${noteId}/`);
  const { id, current_user_read } = data;

  if (!current_user_read) {
    readNote([id]);
  }

  return data;
};

export const postNote = async (noteData: Partial<Note>) => {
  const formData = new FormData();
  if (noteData.content) {
    formData.append('content', noteData.content);
  }
  if (noteData.images) {
    noteData.images.forEach((element) => {
      formData.append('images', element);
    });
  }

  const { data } = await axiosFormDataInstance.post(`notes/`, formData);
  return data;
};

export const updateNote = async (noteId: number, noteData: Partial<Note>) => {
  const noteFormData = objectFormDataSerializer(noteData);
  const { data } = await axios.put(`/notes/${noteId}/`, noteFormData);
  return data;
};

export const deleteNote = async (noteId: number) => {
  await axios.delete(`/notes/${noteId}/`);
};

export const getNoteComments = async (noteId: number, page: string | null) => {
  const requestPage = page ? page.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<Comment[]>>(
    `/notes/${noteId}/comments${!requestPage ? '' : `?page=${requestPage}`}`,
  );
  return data;
};

export const readNote = async (ids: number[]) => {
  await axios.patch('/notes/read/', { ids });
};

export const getNoteDetailLikes = async (noteId: number, page: string | null) => {
  const requestPage = page ? page.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<Like[]>>(
    `/notes/${noteId}/likes${!requestPage ? '' : `?page=${requestPage}`}`,
  );
  return data;
};
