import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { 
  Calendar, 
  Person, 
  ArrowLeft,
  Clock,
  Eye,
  Share,
  Bookmark,
  Heart
} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

interface BlogPostProps {
  post: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    readTime: string;
    category: string;
    tags: string[];
    featured: boolean;
    views: number;
    slug: string;
  };
}

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
  const navigate = useNavigate();

  // Convert content with emojis and formatting to JSX
  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      // Handle headers (lines starting with emoji + text)
      if (/^[🎭🌍🦹‍♀️📖🚀👉🧠🎯💾🔗🎬💡🔧🎮🇮🇳🇷🇺🌏🚌🧸]/.test(line)) {
        return <h3 key={index} className="mt-4 mb-3 fw-bold">{line}</h3>;
      }
      
      // Handle subheaders (lines with **text**)
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <h4 key={index} className="mt-3 mb-2 fw-semibold">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
          </h4>
        );
      }
      
      // Handle lists (lines starting with -)
      if (line.trim().startsWith('-')) {
        return (
          <li key={index} className="mb-1">
            {line.trim().substring(1).trim()}
          </li>
        );
      }
      
      // Handle numbered lists
      if (/^\d+\./.test(line.trim())) {
        return (
          <li key={index} className="mb-1">
            {line.trim()}
          </li>
        );
      }
      
      // Regular paragraph
      return <p key={index} className="mb-3">{line}</p>;
    });
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | MosCownpur Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={post.tags.join(', ')} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.moscownpur.in/blog/${post.slug}`} />
        <link rel="canonical" href={`https://www.moscownpur.in/blog/${post.slug}`} />
      </Helmet>

      <div className="min-vh-100 bg-black text-white py-5">
        <Container>
          {/* Back Button */}
          <Row className="mb-4">
            <Col>
              <Button 
                variant="outline-primary" 
                onClick={() => navigate('/blog')}
                className="d-flex align-items-center gap-2"
              >
                <ArrowLeft /> Back to Blog
              </Button>
            </Col>
          </Row>

          {/* Article Header */}
          <Row className="mb-5">
            <Col lg={8} className="mx-auto">
              <div className="text-center mb-4">
                <Badge bg="primary" className="mb-3 px-3 py-2 fs-6">
                  {post.category}
                </Badge>
                <h1 className="display-4 fw-bold mb-4">{post.title}</h1>
                <p className="lead mb-4">{post.excerpt}</p>
                
                {/* Article Meta */}
                <div className="d-flex justify-content-center align-items-center gap-4 mb-4 flex-wrap">
                  <div className="d-flex align-items-center">
                    <Person className="me-2" />
                    <span>{post.author}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <Calendar className="me-2" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <Clock className="me-2" />
                    <span>{post.readTime}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <Eye className="me-2" />
                    <span>{post.views.toLocaleString()} views</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} bg="secondary" className="px-3 py-2">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-center gap-3 mb-4">
                  <Button variant="outline-primary" size="sm">
                    <Share className="me-2" />
                    Share
                  </Button>
                  <Button variant="outline-secondary" size="sm">
                    <Bookmark className="me-2" />
                    Save
                  </Button>
                  <Button variant="outline-danger" size="sm">
                    <Heart className="me-2" />
                    Like
                  </Button>
                </div>
              </div>
            </Col>
          </Row>

          {/* Article Content */}
          <Row>
            <Col lg={8} className="mx-auto">
              <Card className="bg-dark border-0 shadow-lg">
                <Card.Body className="p-5">
                  <div className="article-content">
                    {formatContent(post.content)}
                  </div>
                  
                  {/* Article Footer */}
                  <hr className="my-5" />
                  <div className="text-center">
                    <h5 className="mb-3">Enjoyed this article?</h5>
                    <p className="text-muted mb-4">
                      Share it with fellow creators and storytellers who might find it helpful.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                      <Button variant="primary">
                        Share on Twitter
                      </Button>
                      <Button variant="outline-primary">
                        Share on LinkedIn
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Related Articles Suggestion */}
          <Row className="mt-5">
            <Col>
              <div className="text-center">
                <h3 className="mb-4">Continue Your Creative Journey</h3>
                <p className="lead mb-4">
                  Explore more articles to enhance your world building and storytelling skills.
                </p>
                <Button 
                  variant="outline-primary" 
                  size="lg"
                  onClick={() => navigate('/blog')}
                >
                  Browse All Articles
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default BlogPost;
