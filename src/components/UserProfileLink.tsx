import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from 'react-bootstrap';

interface UserProfileLinkProps {
  userId: string;
  username?: string | null;
  fullName?: string | null;
  showAvatar?: boolean;
  avatarUrl?: string | null;
  className?: string;
  variant?: 'link' | 'badge' | 'button';
}

const UserProfileLink: React.FC<UserProfileLinkProps> = ({
  userId,
  username,
  fullName,
  showAvatar = false,
  avatarUrl,
  className = '',
  variant = 'link'
}) => {
  if (!username) {
    return <span className="text-muted">Anonymous User</span>;
  }

  const displayName = fullName || username;
  const profileUrl = `/profile/${username}`;

  if (variant === 'badge') {
    return (
      <Badge 
        as={Link} 
        to={profileUrl} 
        bg="secondary" 
        className={`text-decoration-none ${className}`}
      >
        {showAvatar && avatarUrl && (
          <img
            src={avatarUrl}
            alt={`${displayName}'s avatar`}
            className="rounded-circle me-1"
            style={{ width: '16px', height: '16px', objectFit: 'cover' }}
          />
        )}
        {displayName}
      </Badge>
    );
  }

  if (variant === 'button') {
    return (
      <Link 
        to={profileUrl} 
        className={`btn btn-outline-secondary btn-sm ${className}`}
      >
        {showAvatar && avatarUrl && (
          <img
            src={avatarUrl}
            alt={`${displayName}'s avatar`}
            className="rounded-circle me-1"
            style={{ width: '16px', height: '16px', objectFit: 'cover' }}
          />
        )}
        {displayName}
      </Link>
    );
  }

  return (
    <Link 
      to={profileUrl} 
      className={`text-decoration-none ${className}`}
    >
      {showAvatar && avatarUrl && (
        <img
          src={avatarUrl}
          alt={`${displayName}'s avatar`}
          className="rounded-circle me-1"
          style={{ width: '16px', height: '16px', objectFit: 'cover' }}
        />
      )}
      {displayName}
    </Link>
  );
};

export default UserProfileLink;

