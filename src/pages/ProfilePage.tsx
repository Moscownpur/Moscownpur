import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Container, Row, Col, Card, Badge, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, stats, loading, error } = useProfile(username || '');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isOwnProfile = user?.id === profile?.id;

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Container>
          <Row className="justify-content-center">
            <Col md={6}>
              <Alert variant="danger" className="text-center">
                <Alert.Heading>Profile Not Found</Alert.Heading>
                <p>{error}</p>
                <hr />
                <div className="d-flex justify-content-center">
                  <button 
                    className="btn btn-outline-danger"
                    onClick={() => navigate('/')}
                  >
                    Go Home
                  </button>
                </div>
              </Alert>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{profile.full_name || profile.username} - Profile | Moscowvitz</title>
        <meta name="description" content={`View ${profile.full_name || profile.username}'s profile and creative works on Moscowvitz.`} />
        <meta property="og:title" content={`${profile.full_name || profile.username} - Profile`} />
        <meta property="og:description" content={`View ${profile.full_name || profile.username}'s profile and creative works on Moscowvitz.`} />
        <meta property="og:type" content="profile" />
        {profile.avatar_url && <meta property="og:image" content={profile.avatar_url} />}
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        <Container className="py-5">
          {/* Profile Header */}
          <Row className="mb-5">
            <Col>
              <Card className="bg-dark border-secondary">
                <Card.Body className="p-4">
                  <Row className="align-items-center">
                    <Col md="auto">
                      <div className="profile-avatar">
                        {profile.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt={`${profile.full_name || profile.username}'s avatar`}
                            className="rounded-circle"
                            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div 
                            className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                            style={{ width: '120px', height: '120px' }}
                          >
                            <span className="text-white fs-1 fw-bold">
                              {(profile.full_name || profile.username || 'U').charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col>
                      <div className="profile-info">
                        <h1 className="h2 mb-2 text-white">
                          {profile.full_name || 'Anonymous User'}
                        </h1>
                        <p className="text-muted mb-2">@{profile.username}</p>
                        <p className="text-muted mb-3">
                          Member since {formatDate(profile.created_at)}
                        </p>
                        {isOwnProfile && (
                          <Badge bg="success" className="me-2">
                            Your Profile
                          </Badge>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Statistics */}
          {stats && (
            <Row className="mb-5">
              <Col>
                <Card className="bg-dark border-secondary">
                  <Card.Header className="bg-secondary text-white">
                    <h4 className="mb-0">Creative Works</h4>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={3} className="text-center mb-3">
                        <div className="stat-item">
                          <h3 className="text-primary mb-1">{stats.worlds_count}</h3>
                          <p className="text-muted mb-0">Worlds</p>
                        </div>
                      </Col>
                      <Col md={3} className="text-center mb-3">
                        <div className="stat-item">
                          <h3 className="text-info mb-1">{stats.characters_count}</h3>
                          <p className="text-muted mb-0">Characters</p>
                        </div>
                      </Col>
                      <Col md={3} className="text-center mb-3">
                        <div className="stat-item">
                          <h3 className="text-warning mb-1">{stats.scenes_count}</h3>
                          <p className="text-muted mb-0">Scenes</p>
                        </div>
                      </Col>
                      <Col md={3} className="text-center mb-3">
                        <div className="stat-item">
                          <h3 className="text-success mb-1">{stats.events_count}</h3>
                          <p className="text-muted mb-0">Events</p>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Recent Activity Placeholder */}
          <Row>
            <Col>
              <Card className="bg-dark border-secondary">
                <Card.Header className="bg-secondary text-white">
                  <h4 className="mb-0">Recent Activity</h4>
                </Card.Header>
                <Card.Body>
                  <div className="text-center text-muted py-4">
                    <p>Recent activity will be displayed here soon.</p>
                    <small>This feature is coming in a future update.</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ProfilePage;
