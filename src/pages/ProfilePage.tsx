import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useUserBadges } from '../hooks/useUserBadges';
import { useInviteCode } from '../hooks/useInviteCodes';
import LoadingSpinner from '../components/LoadingSpinner';
import { User, Trophy, Star, Users, UserPlus, Calendar, Link, Globe } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, stats, loading, error } = useProfile(username || '');
  const { badges: userBadges } = useUserBadges(profile?.id);
  const { inviteCode } = useInviteCode(profile?.id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getBadgeRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-400';
      case 'epic': return 'from-purple-400 to-pink-400';
      case 'rare': return 'from-blue-400 to-cyan-400';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getBadgeGlow = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'shadow-yellow-400/50';
      case 'epic': return 'shadow-purple-400/50';
      case 'rare': return 'shadow-blue-400/50';
      default: return 'shadow-gray-400/50';
    }
  };

  const getBadgeIcon = (name: string) => {
    if (name.toLowerCase().includes('world')) return Globe;
    if (name.toLowerCase().includes('character')) return User;
    if (name.toLowerCase().includes('invite')) return UserPlus;
    if (name.toLowerCase().includes('milestone')) return Calendar;
    if (name.toLowerCase().includes('primordial')) return Star;
    return Trophy;
  };

  const isOwnProfile = user?.id === profile?.id;

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-400 mb-4">Profile Not Found</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 px-6 py-3 rounded-lg transition-all duration-300 text-red-400 hover:text-red-300"
            onClick={() => navigate('/')}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{profile.display_name || profile.full_name || profile.username} - Profile | Moscowvitz</title>
        <meta name="description" content={`View ${profile.display_name || profile.full_name || profile.username}'s profile and creative works on Moscowvitz.`} />
        <meta property="og:title" content={`${profile.display_name || profile.full_name || profile.username} - Profile`} />
        <meta property="og:description" content={`View ${profile.display_name || profile.full_name || profile.username}'s profile and creative works on Moscowvitz.`} />
        <meta property="og:type" content="profile" />
        {profile.avatar_url && <meta property="og:image" content={profile.avatar_url} />}
      </Helmet>

      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-pink-900/20"></div>
          <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="fixed inset-0 z-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
          {/* Main Profile Header */}
          <div className="mb-8">
            <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-cyan-500/30 p-8 shadow-2xl relative overflow-hidden">
              {/* Glowing border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-50 blur-xl"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-8">
                  {/* Avatar Section */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
                    <div className="relative">
                      {profile.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt={profile.display_name || profile.full_name || profile.username || 'User'}
                          className="w-32 h-32 rounded-full object-cover border-4 border-cyan-400/50"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center border-4 border-cyan-400/50">
                          <span className="text-4xl font-bold text-white">
                            {((profile.display_name || profile.full_name || profile.username || 'U') as string).charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 text-center lg:text-left">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {profile.display_name || profile.full_name || 'Anonymous User'}
                    </h1>
                    <p className="text-cyan-400 mb-3 font-mono">@{profile.username}</p>
                    {profile.tagline && (
                      <p className="text-pink-400 mb-4 font-medium">"{profile.tagline}"</p>
                    )}
                    {profile.bio && (
                      <p className="text-gray-300 mb-4 max-w-2xl leading-relaxed">{profile.bio}</p>
                    )}
                    
                    {/* Social Stats */}
                    <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-4">
                      <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-cyan-500/30">
                        <Users size={16} className="text-cyan-400" />
                        <span className="text-cyan-400 font-semibold">{formatNumber(profile.followers_count || 0)}</span>
                        <span className="text-gray-400 text-sm">Followers</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-purple-500/30">
                        <UserPlus size={16} className="text-purple-400" />
                        <span className="text-purple-400 font-semibold">{formatNumber(profile.following_count || 0)}</span>
                        <span className="text-gray-400 text-sm">Following</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm">
                      <span className="bg-gray-800/50 px-3 py-1 rounded-full border border-green-500/30 flex items-center gap-2">
                        <Calendar size={14} className="text-green-400" />
                        <span className="text-gray-300">Joined: {formatDate(profile.created_at)}</span>
                      </span>
                      {isOwnProfile && (
                        <span className="bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30 text-green-400">
                          Your Profile
                        </span>
                      )}
                    </div>
                  </div>

                  {/* XP Score */}
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-cyan-500/30 min-w-[200px]">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-cyan-400 mb-2">{formatNumber(stats?.calculated_xp || profile.xp_score || 0)}</div>
                      <div className="text-sm text-gray-400 mb-4">Total XP Score</div>
                      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden mb-2">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50" 
                          style={{ width: `${Math.min(((stats?.calculated_xp || profile.xp_score || 0) / 100), 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-400">Neural Operative LV {Math.floor((stats?.calculated_xp || profile.xp_score || 0) / 100)}</div>
                      
                      {/* XP Breakdown */}
                      {stats && (
                        <div className="mt-4 text-xs text-gray-500 space-y-1">
                          <div>Badge XP: +{formatNumber(stats.badge_xp_rewards)}</div>
                          <div>Worlds: +{formatNumber(stats.worlds_count * 100)}</div>
                          <div>Characters: +{formatNumber(stats.characters_count * 200)}</div>
                          <div>Scenes: +{formatNumber(stats.scenes_count * 50)}</div>
                          <div>Events: +{formatNumber(stats.events_count * 25)}</div>
                          <div>Invites: +{formatNumber((profile.invite_count || 0) * 500)}</div>
                          <div>Dialogues: +{formatNumber(stats.dialogues_count * 10)}</div>
                          <div>Base: +1,000</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Invite Link Section - Only show for own profile */}
                {isOwnProfile && (
                  <div className="bg-gray-800/30 rounded-xl p-4 border border-pink-500/30">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Link size={20} className="text-pink-400" />
                        <div>
                          <div className="text-pink-400 font-semibold">Your Invite Code</div>
                          <div className="text-gray-300 font-mono text-sm">
                            {inviteCode || 'Loading...'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-pink-400">{profile.invite_count || 0}</div>
                          <div className="text-xs text-gray-400">Invites Sent</div>
                        </div>
                        <button 
                          className="bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/50 px-4 py-2 rounded-lg transition-all duration-300 text-pink-400 hover:text-pink-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!inviteCode}
                          onClick={() => {
                            if (inviteCode) {
                              navigator.clipboard.writeText(inviteCode);
                              // You could add a toast notification here
                            }
                          }}
                        >
                          {inviteCode ? 'Copy Code' : 'Loading...'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Creative Works & Badges */}
            <div className="lg:col-span-2 space-y-8">
              {/* Creative Works Stats */}
              {stats && (
                <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-green-500/30 p-6 shadow-2xl">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-green-400">
                    <Globe size={24} />
                    Creative Works
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center bg-gray-800/50 rounded-xl p-6 border border-green-500/20">
                      <div className="text-4xl font-bold text-green-400 mb-2">{stats.worlds_count}</div>
                      <div className="text-gray-400">Worlds Created</div>
                      <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                        <div className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full" style={{ width: '76%' }}></div>
                      </div>
                    </div>
                    <div className="text-center bg-gray-800/50 rounded-xl p-6 border border-blue-500/20">
                      <div className="text-4xl font-bold text-blue-400 mb-2">{stats.characters_count}</div>
                      <div className="text-gray-400">Characters Designed</div>
                      <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                        <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    <div className="text-center bg-gray-800/50 rounded-xl p-6 border border-yellow-500/20">
                      <div className="text-4xl font-bold text-yellow-400 mb-2">{stats.scenes_count}</div>
                      <div className="text-gray-400">Scenes Written</div>
                      <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                        <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                    <div className="text-center bg-gray-800/50 rounded-xl p-6 border border-purple-500/20">
                      <div className="text-4xl font-bold text-purple-400 mb-2">{stats.events_count}</div>
                      <div className="text-gray-400">Events Created</div>
                      <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                        <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" style={{ width: '84%' }}></div>
                      </div>
                    </div>
                    <div className="text-center bg-gray-800/50 rounded-xl p-6 border border-cyan-500/20">
                      <div className="text-4xl font-bold text-cyan-400 mb-2">{stats.dialogues_count}</div>
                      <div className="text-gray-400">Dialogues Written</div>
                      <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                        <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Badges Section */}
              {userBadges && userBadges.length > 0 && (
                <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-yellow-500/30 p-6 shadow-2xl">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-yellow-400">
                    <Trophy size={24} />
                    Achievement Badges
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {userBadges.map((badge) => {
                      const IconComponent = getBadgeIcon(badge.name);
                      return (
                        <div key={badge.badge_id} className="group cursor-pointer">
                          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300 transform hover:scale-105">
                            <div className="flex items-center gap-4">
                              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getBadgeRarityColor(badge.rarity || 'common')} p-4 shadow-lg ${getBadgeGlow(badge.rarity || 'common')}`}>
                                <IconComponent size={32} className="text-black" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-white mb-1">{badge.name}</div>
                                <div className="text-sm text-gray-400 mb-2">{badge.description}</div>
                                <div className="flex items-center justify-between">
                                  <div className={`text-xs capitalize font-medium px-2 py-1 rounded-full ${
                                    badge.rarity === 'legendary' ? 'bg-yellow-400/20 text-yellow-400' :
                                    badge.rarity === 'epic' ? 'bg-purple-400/20 text-purple-400' :
                                    badge.rarity === 'rare' ? 'bg-blue-400/20 text-blue-400' : 'bg-gray-400/20 text-gray-400'
                                  }`}>
                                    {badge.rarity || 'common'}
                                  </div>
                                  <div className="text-xs text-gray-500">{formatDate(badge.earned_at)}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            {/* Empty sidebar space for better layout */}
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
