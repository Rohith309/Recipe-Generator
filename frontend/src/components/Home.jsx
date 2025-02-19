import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1>Your AI-powered kitchen assistant</h1>
          <p>Transform your cooking experience with personalized recipes, smart suggestions, and endless culinary inspiration.</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">Get Started Free</Link>
            <button className="btn-secondary">Watch Demo</button>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src="https://images.unsplash.com/photo-1556911261-6bd341186b2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="People cooking together in kitchen"
          />
        </div>
      </div>

      <div className="features-section">
        <div className="features-header">
          <h2>Smart Features for Smart Cooking</h2>
          <p>Everything you need to create amazing meals with ease</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-robot"></i>
            </div>
            <h3>AI-Powered</h3>
            <p>Personalized recipe suggestions based on your available ingredients</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-book"></i>
            </div>
            <h3>Create & Save</h3>
            <p>Build and organize your personal cookbook with favorite recipes</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-cloud"></i>
            </div>
            <h3>Easy Access</h3>
            <p>Access your recipes anytime, anywhere with cloud storage</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Cooking?</h2>
          <p>Join thousands of home chefs who are already creating amazing meals with RecipeAI</p>
          <Link to="/register" className="cta-button">
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
} 