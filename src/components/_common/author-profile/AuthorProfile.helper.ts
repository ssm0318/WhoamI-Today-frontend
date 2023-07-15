import { AdminAuthor, isAdminAuthor } from '@models/post';
import { User } from '@models/user';

export const getAuthorProfileInfo = (author: User | AdminAuthor) => {
  if (isAdminAuthor(author)) {
    return {
      username: 'admin',
      imageUrl: '',
    };
  }

  const { username, profile_image } = author;
  return {
    username,
    imageUrl: profile_image,
  };
};
