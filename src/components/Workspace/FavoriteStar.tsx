/**
 * FavoriteStar — small star toggle shown next to nav items on hover
 */

import { useFavorites } from '../../stores/workspace';
import { Button } from '../Button';

interface FavoriteStarProps {
  pageId: string;
}

function StarIcon({ starred }: { starred: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1L10.1 5.3L15 6L11.5 9.4L12.3 14.3L8 12L3.7 14.3L4.5 9.4L1 6L5.9 5.3L8 1Z"
        fill={starred ? 'var(--color-warning-1)' : 'none'}
        stroke={starred ? 'var(--color-warning-1)' : 'currentColor'}
        strokeWidth="1.2"
        strokeLinejoin="round"
        style={{ opacity: starred ? 1 : 0.6 }}
      />
    </svg>
  );
}

export function FavoriteStar({ pageId }: FavoriteStarProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const starred = isFavorite(pageId);

  return (
    <Button
      variant="elevated"
      size="md"
      className="!p-[10px] !rounded-xl"
      aria-label={starred ? 'Remove from favorites' : 'Add to favorites'}
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(pageId);
      }}
    >
      <StarIcon starred={starred} />
    </Button>
  );
}
