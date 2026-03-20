import { AdminAuthor, Note, Response } from './post';
import { User } from './user';

export enum DiscoverFilter {
  follow = 'follow',
  MUTUAL_FRIENDS = 'mutual_friends',
  MUTUAL_TRAITS = 'mutual_traits',
}

export const DiscoverFilterLabel = {
  [DiscoverFilter.follow]: 'People I follow',
  [DiscoverFilter.MUTUAL_FRIENDS]: 'Mutual Friends',
  [DiscoverFilter.MUTUAL_TRAITS]: 'Mutual Traits',
};

// Response Card Body (type: "Response")
export type ResponseCardBody = Response;

// Note Card Body (type: "Note")
export type NoteCardBody = Note;

// Question Card Body (type: "Question")
export interface QuestionCardBody {
  id: number;
  type: 'Question';
  content: string;
  created_at: string;
  selected_dates: string[];
  is_admin_question: boolean;
}

// Interest Item
export interface InterestItem {
  content: string;
  is_selected: boolean;
}

// Interest Card Body (type: "Interest")
export interface InterestCardBody {
  list: InterestItem[];
}

// Persona Item
export interface PersonaItem {
  key: string;
  label: string;
  is_selected: boolean;
}

// Persona Card Body (type: "Persona")
export interface PersonaCardBody {
  list: PersonaItem[];
}

// Music Track in Discover Feed
export interface DiscoverMusicTrack {
  id: number;
  user: {
    id: number;
    username: string;
    profile_pic?: string | null;
    url: string;
    profile_image?: string | null;
  };
  track_id: string;
  created_at: string;
}

// Discover Result Item (discriminated union)
export type DiscoverResultItem =
  | {
      type: 'Response';
      body: ResponseCardBody;
    }
  | {
      type: 'Note';
      body: NoteCardBody;
    }
  | {
      type: 'Question';
      body: QuestionCardBody;
      author_detail?: User | AdminAuthor;
    }
  | {
      type: 'Interest';
      body: InterestCardBody;
    }
  | {
      type: 'Persona';
      body: PersonaCardBody;
    };
