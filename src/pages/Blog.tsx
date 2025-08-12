import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { 
  Search, 
  Calendar, 
  Person, 
  Tag, 
  ArrowRight,
  Book,
  Lightbulb,
  Star,
  Clock,
  Eye
} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import blogData from '../data/blogPosts.json';

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { posts: blogPosts, categories, popularTags } = blogData;
  const featuredPost = blogPosts.find(post => post.featured);

  // Filter posts based on search and category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePostClick = (post: any) => {
    navigate(`/blog/${post.slug}`);
  };

  return (
    <>
      <Helmet>
        <title>Blog - Creative Writing Tips & World Building Resources | MosCownpur</title>
        <meta name="description" content="Discover expert tips, tutorials, and resources for world building, character development, and creative writing. Learn from professional authors and enhance your storytelling skills." />
        <meta name="keywords" content="creative writing blog, world building tips, character development guide, writing tutorials, universe creation resources, storytelling advice, author tips" />
        <meta property="og:title" content="Blog - Creative Writing Tips & World Building Resources | MosCownpur" />
        <meta property="og:description" content="Discover expert tips, tutorials, and resources for world building, character development, and creative writing. Learn from professional authors and enhance your storytelling skills." />
        <meta property="og:type" content="blog" />
        <meta property="og:url" content="https://www.moscownpur.in/blog" />
        <link rel="canonical" href="https://www.moscownpur.in/blog" />
      </Helmet>

      <div className="min-vh-100 bg-black text-white py-5">
        <Container>
          {/* Hero Section */}
          <Row className="text-center mb-5">
            <Col>
              <h1 className="display-4 fw-bold mb-4">
                Creative Writing <span className="text-primary">Blog</span>
              </h1>
              <p className="lead mb-4">
                Expert tips, tutorials, and resources for world building, character development, 
                and creative writing. Learn from professional authors and enhance your storytelling skills.
              </p>
              
                             {/* Search Bar */}
               <div className="row justify-content-center mb-4">
                 <div className="col-md-6">
                   <InputGroup>
                     <InputGroup.Text className="bg-dark border-0">
                       <Search />
                     </InputGroup.Text>
                     <Form.Control 
                       type="text" 
                       placeholder="Search articles..." 
                       className="bg-dark border-0 text-white"
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                     />
                     <Button variant="primary">Search</Button>
                   </InputGroup>
                 </div>
               </div>

              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Badge bg="primary" className="fs-6 px-3 py-2">World Building</Badge>
                <Badge bg="success" className="fs-6 px-3 py-2">Character Development</Badge>
                <Badge bg="warning" className="fs-6 px-3 py-2">Writing Tips</Badge>
                <Badge bg="info" className="fs-6 px-3 py-2">AI Tools</Badge>
              </div>
            </Col>
          </Row>

          {/* Featured Post */}
          {featuredPost && (
            <Row className="mb-5">
              <Col>
                <Card className="bg-dark border-0 shadow-lg">
                  <Card.Body className="p-4">
                    <div className="row">
                      <div className="col-lg-8">
                        <Badge bg="warning" className="mb-3">Featured Article</Badge>
                        <h2 className="mb-3">{featuredPost.title}</h2>
                        <p className="lead mb-4">{featuredPost.excerpt}</p>
                        <div className="d-flex align-items-center gap-4 mb-4">
                          <div className="d-flex align-items-center">
                            <Person className="me-2" />
                            <span>{featuredPost.author}</span>
                          </div>
                          <div className="d-flex align-items-center">
                            <Calendar className="me-2" />
                            <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                          </div>
                          <div className="d-flex align-items-center">
                            <Clock className="me-2" />
                            <span>{featuredPost.readTime}</span>
                          </div>
                          <div className="d-flex align-items-center">
                            <Eye className="me-2" />
                            <span>{featuredPost.views.toLocaleString()} views</span>
                          </div>
                        </div>
                        <div className="d-flex gap-2 mb-4">
                          {featuredPost.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} bg="secondary" className="px-2 py-1">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                                                 <Button 
                           variant="primary" 
                           size="lg"
                           onClick={() => handlePostClick(featuredPost)}
                         >
                           Read Full Article <ArrowRight className="ms-2" />
                         </Button>
                      </div>
                      <div className="col-lg-4 d-flex align-items-center justify-content-center">
                        <div className="text-center">
                          <Book size={80} className="text-primary mb-3" />
                          <h5>Featured Article</h5>
                          <p className="text-muted">Most popular this week</p>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Categories and Blog Posts */}
          <Row>
            {/* Sidebar */}
            <Col lg={3} className="mb-5">
              <div className="sticky-top" style={{ top: '2rem' }}>
                {/* Categories */}
                <Card className="bg-dark border-0 shadow-lg mb-4">
                  <Card.Body>
                    <h5 className="mb-3">Categories</h5>
                    {categories.map((category, index) => (
                      <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                        <span>{category.name}</span>
                        <Badge bg={category.color}>{category.count}</Badge>
                      </div>
                    ))}
                  </Card.Body>
                </Card>

                {/* Popular Tags */}
                <Card className="bg-dark border-0 shadow-lg">
                  <Card.Body>
                    <h5 className="mb-3">Popular Tags</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {popularTags.map((tag, index) => (
                        <Badge key={index} bg="secondary" className="px-2 py-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>

                         {/* Blog Posts */}
             <Col lg={9}>
               <Row className="g-4">
                 {filteredPosts.filter(post => !post.featured).map((post, index) => (
                   <Col key={index} md={6}>
                     <Card 
                       className="h-100 bg-dark border-0 shadow-lg hover-lift cursor-pointer"
                       onClick={() => handlePostClick(post)}
                       style={{ cursor: 'pointer' }}
                     >
                       <Card.Body className="p-4">
                         <div className="d-flex justify-content-between align-items-start mb-3">
                           <Badge bg="primary">{post.category}</Badge>
                           <small className="text-muted">
                             <Eye className="me-1" />
                             {post.views.toLocaleString()}
                           </small>
                         </div>
                         <h5 className="mb-3">{post.title}</h5>
                         <p className="text-muted mb-3">{post.excerpt}</p>
                         <div className="d-flex align-items-center gap-3 mb-3">
                           <div className="d-flex align-items-center">
                             <Person className="me-1" size={14} />
                             <small>{post.author}</small>
                           </div>
                           <div className="d-flex align-items-center">
                             <Calendar className="me-1" size={14} />
                             <small>{new Date(post.date).toLocaleDateString()}</small>
                           </div>
                           <div className="d-flex align-items-center">
                             <Clock className="me-1" size={14} />
                             <small>{post.readTime}</small>
                           </div>
                         </div>
                         <div className="d-flex gap-2 mb-3">
                           {post.tags.slice(0, 2).map((tag, idx) => (
                             <Badge key={idx} bg="secondary" className="px-2 py-1 small">
                               {tag}
                             </Badge>
                           ))}
                         </div>
                         <Button variant="outline-primary" size="sm">
                           Read More <ArrowRight className="ms-1" />
                         </Button>
                       </Card.Body>
                     </Card>
                   </Col>
                 ))}
               </Row>

              {/* Load More Button */}
              <Row className="mt-5">
                <Col className="text-center">
                  <Button variant="outline-primary" size="lg">
                    Load More Articles
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Newsletter Signup */}
          <Row className="mt-5">
            <Col>
              <Card className="bg-gradient-primary border-0 shadow-lg">
                <Card.Body className="p-5 text-center">
                  <h3 className="mb-3">Stay Updated with Writing Tips</h3>
                  <p className="lead mb-4">
                    Get the latest world building tips, character development advice, and creative writing 
                    resources delivered to your inbox every week.
                  </p>
                  <div className="row justify-content-center">
                    <div className="col-md-6">
                      <InputGroup>
                        <Form.Control 
                          type="email" 
                          placeholder="Enter your email address" 
                          className="bg-dark border-0 text-white"
                        />
                        <Button variant="light">Subscribe</Button>
                      </InputGroup>
                      <small className="text-muted mt-2 d-block">
                        No spam, unsubscribe anytime. We respect your privacy.
                      </small>
                    </div>
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

export default Blog;

