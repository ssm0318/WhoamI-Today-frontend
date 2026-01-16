import { AdminAuthor, Response } from './post';
import { User } from './user';

export enum DiscoverFilter {
  follow = 'follow',
  MUTUAL_FRIENDS = 'mutual_friends',
  MUTUAL_TRAITS = 'mutual_traits',
}

export const DiscoverFilterLabel = {
  [DiscoverFilter.follow]: 'People I follow',
  [DiscoverFilter.MUTUAL_FRIENDS]: 'People I have mutual friends with',
  [DiscoverFilter.MUTUAL_TRAITS]: 'People I have mutual traits with',
};

// Response Card Body (type: "Response")
export type ResponseCardBody = Response;

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

// Discover Result Item (discriminated union)
export type DiscoverResultItem =
  | {
      type: 'Response';
      body: ResponseCardBody;
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
