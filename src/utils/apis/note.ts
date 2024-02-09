import axios from 'axios';
import { PaginationResponse } from '@models/api/common';
import { Note } from '@models/note';

// GET all notes (pagination) TBU
export const getAllNotes = async (page: string | null) => {
  const requestPage = page ? page.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<Note[]>>(
    `/feed/notes/${!requestPage ? '' : `?page=${requestPage}`}`,
  );
  return data;
};
