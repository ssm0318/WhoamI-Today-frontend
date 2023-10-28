import { Categories } from 'emoji-picker-react';
import { CategoriesConfig } from 'emoji-picker-react/dist/config/categoryConfig';

// SUGGESTED 카테고리는 제외
export const EMOJI_CATEGORIES: CategoriesConfig = Object.values(Categories)
  .filter((c) => c !== Categories.SUGGESTED)
  .map((category) => ({
    category,
    name: category,
  }));
