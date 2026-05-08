import { PaginationResponse } from '@models/api/common';
import {
  Comment,
  Like,
  MissionGroupItem,
  NewNoteForm,
  Note,
  NoteFeedItem,
  POST_TYPE,
  PostReaction,
} from '@models/post';
import axios, { axiosFormDataInstance } from '@utils/apis/axios';
import { compareMissionAttemptOrder } from '@utils/missionHelpers';
import { objectFormDataSerializer } from '@utils/validateHelpers';

export const getNoteList = async (page: string | null) => {
  const requestPage = page ? page.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<NoteFeedItem[]>>(
    `/notes/${!requestPage ? '' : `?page=${requestPage}`}`,
  );
  return data;
};

/** @param notesApiPrefix `q/` so `/api/q/notes/<id>/` uses Q serializers (likes fields) for Ver.Q viewers */
export const getNoteDetail = async (noteId: number, notesApiPrefix = '') => {
  const { data } = await axios.get<Note>(`${notesApiPrefix}notes/${noteId}/`);
  const { id, current_user_read } = data;

  if (!current_user_read) {
    readNote([id]);
  }

  return data;
};

export const postNote = async (
  noteData: NewNoteForm,
  onUploadProgress?: (progress: number) => void,
) => {
  const formData = new FormData();
  if (noteData.content) {
    formData.append('content', noteData.content);
  }
  if (noteData.images) {
    noteData.images.forEach((img, index) => {
      formData.append('images', img.file, `${index}`);
    });
  }
  if (noteData.visibility && noteData.visibility.length > 0) {
    formData.append('visibility', JSON.stringify(noteData.visibility));
  }
  if (noteData.share_type) {
    formData.append('share_type', noteData.share_type);
  }
  if (noteData.mission_id != null) {
    formData.append('mission_id', String(noteData.mission_id));
  }

  const { data } = await axiosFormDataInstance.post<Note>(`notes/`, formData, {
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onUploadProgress) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(progress);
      }
    },
  });
  return data;
};

export const updateNote = async (noteId: number, noteData: Partial<Note>) => {
  const noteFormData = objectFormDataSerializer(noteData);
  const { data } = await axios.put(`/notes/${noteId}/`, noteFormData);
  return data;
};

export const patchNote = async (noteId: number, noteData: NewNoteForm) => {
  const formData = new FormData();

  if (noteData.content) {
    formData.append('content', noteData.content);
  }
  if (noteData.images) {
    noteData.images.forEach((img, index) => {
      formData.append('images', img.file, `${index}`);
    });
  }
  if (noteData.visibility && noteData.visibility.length > 0) {
    formData.append('visibility', JSON.stringify(noteData.visibility));
  }

  const { data } = await axiosFormDataInstance.patch<Note>(`notes/${noteId}/`, formData);
  return data;
};

export const deleteNote = async ({
  noteId,
  onSuccess,
  onError,
}: {
  noteId: number;
  onSuccess: () => void;
  onError: () => void;
}) => {
  await axios
    .delete(`/notes/${noteId}/`)
    .then(() => onSuccess())
    .catch(() => onError());
};

export const getNoteComments = async (noteId: number, page: string | null) => {
  const requestPage = page ? page.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<Comment[]>>(
    `/notes/${noteId}/comments/${!requestPage ? '' : `?page=${requestPage}`}`,
  );
  return data;
};

export const readNote = async (ids: number[]) => {
  await axios.patch('/notes/read/', { ids });
};

export const getNoteReactions = async (noteId: number, page: string | null) => {
  const requestPage = page ? page.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<PostReaction[]>>(
    `/notes/${noteId}/interactions/${!requestPage ? '' : `?page=${requestPage}`}`,
  );
  return data;
};

export const getNoteDetailLikes = async (noteId: number, page: string | null) => {
  const requestPage = page ? page.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<Like[]>>(
    `/notes/${noteId}/likes/${!requestPage ? '' : `?page=${requestPage}`}`,
  );
  return data;
};

type MissionAttemptsResponse = PaginationResponse<Note[]> & {
  id: number;
  prompt: string;
  type: string;
};

export const getMissionAttempts = async (
  missionId: number,
  authorId?: number,
): Promise<MissionGroupItem | null> => {
  const query = authorId ? `?author=${authorId}` : '';
  const { data } = await axios.get<MissionAttemptsResponse>(
    `missions/${missionId}/attempts/${query}`,
  );
  const notes = data?.results ?? [];
  if (notes.length === 0) return null;
  const sorted = [...notes].sort(compareMissionAttemptOrder);
  const latest = [...notes].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )[0];
  return {
    type: POST_TYPE.MISSION_GROUP,
    mission_id: missionId,
    mission_prompt: latest.mission_prompt ?? null,
    author: latest.author,
    author_detail: latest.author_detail,
    created_at: latest.created_at,
    updated_at: latest.updated_at,
    attempts: sorted,
  };
};
