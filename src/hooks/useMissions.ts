import useSWR from 'swr';
import { Mission } from '@components/share/MissionOfTheDay';
import { getMissions } from '@utils/apis/mission';

const FALLBACK_MISSIONS: Mission[] = [
  { prompt: 'Share a song that matches your mood right now', type: 'song' },
  {
    prompt:
      'Say hi to the WIT user community! Share a public post with something that represents you—a drawing, a favorite item, your pet, etc.',
    type: 'text',
  },
  { prompt: 'Compliment someone today', type: 'compliment' },
  { prompt: 'Post a place you have been this week', type: 'text' },
  { prompt: 'Share something you learned recently', type: 'text' },
  { prompt: 'What are you looking forward to?', type: 'text' },
  { prompt: 'Share a song that reminds you of a friend', type: 'song' },
  { prompt: 'What is your comfort show right now?', type: 'text' },
  { prompt: 'Recommend a podcast or video', type: 'text' },
  { prompt: 'Share a photo from your camera roll', type: 'text' },
  { prompt: 'What is on your mind today?', type: 'question' },
  { prompt: 'Share your current favorite snack', type: 'text' },
  { prompt: 'What hobby have you picked up lately?', type: 'text' },
  { prompt: 'Share a quote that resonates with you', type: 'text' },
  { prompt: 'What made you smile today?', type: 'text' },
  { prompt: 'Share a song you have on repeat', type: 'song' },
  { prompt: 'What is the best thing that happened this week?', type: 'text' },
  { prompt: 'Describe your ideal weekend', type: 'text' },
  { prompt: 'What are you grateful for today?', type: 'text' },
  { prompt: 'Share a movie or show recommendation', type: 'text' },
  { prompt: 'What is something you want to try?', type: 'text' },
  { prompt: 'Share your current desktop or phone wallpaper', type: 'text' },
  { prompt: 'What are you reading right now?', type: 'text' },
  { prompt: 'Share a song that gives you energy', type: 'song' },
  { prompt: 'What is your go-to comfort food?', type: 'text' },
  { prompt: 'Ask your friends for a recommendation', type: 'question' },
  { prompt: 'Share a fun fact about yourself', type: 'text' },
  { prompt: 'What skill do you want to learn?', type: 'text' },
  { prompt: 'Share a song that calms you down', type: 'song' },
  { prompt: 'What is your unpopular opinion?', type: 'text' },
];

export function useMissions() {
  const { data, isLoading } = useSWR('/missions/', getMissions, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
    fallbackData: FALLBACK_MISSIONS,
  });

  const missions: Mission[] = data && data.length > 0 ? data : FALLBACK_MISSIONS;

  return { missions, isLoading };
}
