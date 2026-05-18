import { SharedTrack } from '@components/friends/shared-playlist/SharedPlaylistSection';
import { AdminAuthor, MissionGroupItem, Note, Response } from './post';
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

// MissionGroup Body (type: "MissionGroup")
export type MissionGroupCardBody = MissionGroupItem;

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
  category: string;
  category_label: string;
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

// ProfileSuggestion Card Body (frontend-only injection)
export interface ProfileSuggestionField {
  label: string;
  /** Which Edit Profile tab the chip should open. Omit for fields outside the tabbed sections (e.g. profile photo). */
  tab?: 'interests' | 'pronouns_bio';
}

export interface ProfileSuggestionCardBody {
  missingFields: ProfileSuggestionField[];
}

// SurveyResults Card Body (frontend-only injection)
export interface SurveyResultsCardBody {
  slug: string;
  titleEn: string;
  titleKo: string;
  date: string;
}

// UsernameSuggestion Card Body (frontend-only injection)
export interface UsernameSuggestionCardBody {
  currentUsername: string;
}

// Discover Result Item (discriminated union)
export type DiscoverResultItem =
  | {
      type: 'Response';
      category?: string;
      body: ResponseCardBody;
    }
  | {
      type: 'Note';
      category?: string;
      body: NoteCardBody;
    }
  | MissionGroupCardBody
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
    }
  | {
      type: 'ProfileSuggestion';
      body: ProfileSuggestionCardBody;
    }
  | {
      type: 'SurveyResults';
      body: SurveyResultsCardBody;
    }
  | {
      type: 'UsernameSuggestion';
      body: UsernameSuggestionCardBody;
    }
  // Synthetic card injected only while surveys are paused for maintenance.
  // No body — the card pulls its copy from constants/surveyPause.
  | {
      type: 'SurveyPaused';
    };

export interface DigestMissionSection {
  mission: {
    id: number;
    prompt: string;
    type: string;
    // When non-empty, the digest card swaps "View mission posts" for
    // mission.cta_label and navigates to cta_url verbatim instead of the
    // /missions/<id>?discover=true default.
    cta_url: string;
    cta_label: string;
  };
  posts: Note[];
}

export interface DigestQuestionSection {
  question: QuestionCardBody;
  responses: Response[];
}

export interface DigestMusicSection {
  tracks: SharedTrack[]; // SharedTrack is defined in SharedPlaylistSection
}

export interface DiscoverWResponse {
  yesterday_mission: DigestMissionSection | null;
  yesterday_question: DigestQuestionSection | null;
  yesterday_music: { tracks: DiscoverMusicTrack[] };
  recommended_posts: (Note | Response | MissionGroupItem)[];
}
