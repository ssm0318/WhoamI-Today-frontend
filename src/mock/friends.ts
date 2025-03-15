import { Persona } from '@models/persona';
import { User } from '@models/user';

export const friendList: User[] = [
  {
    id: 1,
    profile_pic: '#04FC0D',
    profile_image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL-L1UhpS9glJRsLpcu8L2COL88RL9e_JIZw&usqp=CAU',
    username: 'test1',
    url: 'http://localhost:8000/api/user/profile/test1/',
    bio: 'test1',
    pronouns: 'test1',
    persona: Persona.lurker,
  },
  {
    id: 2,
    profile_pic: '#04FC0D',
    profile_image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_9HpUdedwvWvuX-EdPNWGWQVOIcYIuI43ouVcm8O6h6_yB-bN8uPt2NyXuyPjd4mDgGk&usqp=CAU',
    username: 'test2',
    url: 'http://localhost:8000/api/user/profile/test2/',
    bio: 'test2',
    pronouns: 'test2',
    persona: Persona.content_creator,
  },
  {
    id: 3,
    profile_pic: '#04FC0D',
    profile_image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNys7iFvBBxifr5E1pgSgnlKxZ8G9HO-47sSR1oW57o1QAXA3YuXsmpVq1WZk9-HkoZls&usqp=CAU',
    username: 'test3',
    url: 'http://localhost:8000/api/user/profile/test3/',
    bio: 'test3',
    pronouns: 'test3',
    persona: Persona.private_reactor,
  },
  {
    id: 4,
    profile_pic: '#04FC0D',
    profile_image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUDvF8l753KHOWjwCmjEO1PfxYe5J95T54IA&usqp=CAU',
    username: 'test4',
    url: 'http://localhost:8000/api/user/profile/test4/',
    bio: 'test4',
    pronouns: 'test4',
    persona: Persona.public_commenter,
  },
  {
    id: 5,
    profile_pic: '#04FC0D',
    profile_image: '',
    username: 'test5',
    url: 'http://localhost:8000/api/user/profile/test5/',
    bio: 'test5',
    pronouns: 'test5',
    persona: Persona.instant_responder,
  },
  {
    id: 6,
    profile_pic: '#04FC0D',
    profile_image: '',
    username: 'test6',
    url: 'http://localhost:8000/api/user/profile/test6/',
    bio: 'test6',
    pronouns: 'test6',
    persona: Persona.takes_my_time,
  },
  {
    id: 7,
    profile_pic: '#04FC0D',
    profile_image: '',
    username: 'test7',
    url: 'http://localhost:8000/api/user/profile/test7/',
    bio: 'test7',
    pronouns: 'test7',
    persona: Persona.daily_scroller,
  },
  {
    id: 8,
    profile_pic: '#04FC0D',
    profile_image: '',
    username: 'test8',
    url: 'http://localhost:8000/api/user/profile/test8/',
    bio: 'test8',
    pronouns: 'test8',
    persona: Persona.occasional_checker,
  },
];
