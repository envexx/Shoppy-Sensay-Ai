import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Zap, Bot, ShoppingBag, Star, Users, TrendingUp, Moon, Sun, MessageCircle, Github, Twitter } from 'lucide-react';
import { useState, useEffect } from 'react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleGetStarted = () => {
    // Navigate to auth page
    navigate('/auth');
  };

  const handleWatchDemo = () => {
    console.log('Watch demo clicked');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Clean Background Effects */}
      <div className="fixed inset-0 -z-10">
        {/* Subtle geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-[#71B836]/20 to-[#71B836]/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-[#71B836]/15 to-[#71B836]/5 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-[#71B836]/10 to-transparent rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-[#71B836]/20 to-transparent rounded-full blur-xl animate-pulse delay-3000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src="./ShoppyS logo .png" 
                alt="ShoppyS Logo" 
                className="w-10 h-10 rounded-xl shadow-lg"
              />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">ShoppyS</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-gray-700 dark:text-gray-300 hover:text-[#71B836] font-medium transition-colors duration-200">Home</button>
              <button onClick={() => scrollToSection('features')} className="text-gray-700 dark:text-gray-300 hover:text-[#71B836] font-medium transition-colors duration-200">Features</button>
              <button onClick={() => scrollToSection('about')} className="text-gray-700 dark:text-gray-300 hover:text-[#71B836] font-medium transition-colors duration-200">About</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-700 dark:text-gray-300 hover:text-[#71B836] font-medium transition-colors duration-200">Contact</button>
            </div>

            {/* Dark Mode Toggle & CTA Button */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleDarkMode}
                className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white hover:bg-white/30 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={handleGetStarted}
                className="bg-[#71B836] hover:bg-[#5A9A2E] text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              Smart Shopping
              <br />
              Made{' '}
              <span className="text-[#71B836] relative">
                Simple
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-[#71B836]/30 rounded-full"></div>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your shopping experience with AI-powered recommendations. 
              Find exactly what you need in seconds, not hours.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <button 
                onClick={handleGetStarted}
                className="bg-[#71B836] hover:bg-[#5A9A2E] text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-3 min-w-[200px]"
              >
                <span>Start Shopping</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button 
                onClick={handleWatchDemo}
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 flex items-center space-x-3 min-w-[200px]"
              >
                <Play className="w-5 h-5 text-[#71B836]" />
                <span>Watch Demo</span>
                <span className="text-sm text-gray-500">2min</span>
              </button>
            </div>

            {/* Demo Preview */}
            <div className="relative max-w-5xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Browser Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-[#71B836] rounded-full"></div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">shoppyui.com</div>
                  <div></div>
                </div>
                
                {/* Chat Interface */}
                <div className="p-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-[#71B836]/10 dark:bg-[#71B836]/20 px-4 py-2 rounded-full">
                      <span className="text-sm font-semibold text-[#71B836] uppercase tracking-wide">AI Shopping Assistant</span>
                    </div>
                  </div>
                  
                  <div className="space-y-6 max-w-3xl mx-auto">
                    {/* AI Message */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#71B836] rounded-full flex items-center justify-center shadow-lg p-2">
                        <img 
                          src="./ShoppyS logo white .png" 
                          alt="ShoppyS Logo" 
                          className="w-8 h-8 rounded-full"
                        />
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-sm px-6 py-4 max-w-md">
                        <p className="text-gray-800 dark:text-gray-200">Hi! I'm here to help you find the perfect products. What are you looking for today?</p>
                      </div>
                    </div>
                    
                    {/* User Message */}
                    <div className="flex items-start space-x-4 justify-end">
                      <div className="bg-[#71B836] rounded-2xl rounded-tr-sm px-6 py-4 max-w-md">
                        <p className="text-white">I need a laptop for graphic design under $1500</p>
                      </div>
                      <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-lg">👤</span>
                      </div>
                    </div>
                    
                    {/* AI Response */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#71B836] rounded-full flex items-center justify-center shadow-lg p-2">
                        <img 
                          src="./ShoppyS logo white .png" 
                          alt="ShoppyS Logo" 
                          className="w-8 h-8 rounded-full"
                        />
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-sm px-6 py-4 max-w-md">
                        <p className="text-gray-800 dark:text-gray-200">Perfect! I found 3 excellent laptops for graphic design within your budget. Here are my top recommendations...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose ShoppyS?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the future of shopping with our advanced AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group text-center p-8 bg-white/20 dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
              <div className="w-20 h-20 bg-[#71B836]/10 dark:bg-[#71B836]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-10 h-10 text-[#71B836]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Get personalized product recommendations in seconds. Our AI processes your needs instantly and delivers perfect matches.</p>
            </div>

            {/* Feature 2 */}
            <div className="group text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
              <div className="w-20 h-20 bg-[#71B836]/10 dark:bg-[#71B836]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Bot className="w-10 h-10 text-[#71B836]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Smart AI Assistant</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Natural conversations that understand context, preferences, and budget constraints to find your perfect products.</p>
            </div>

            {/* Feature 3 */}
            <div className="group text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
              <div className="w-20 h-20 bg-[#71B836]/10 dark:bg-[#71B836]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="w-10 h-10 text-[#71B836]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Seamless Experience</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">From discovery to purchase in one seamless conversation. No more endless scrolling or decision fatigue.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              About ShoppyS
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4">
              We're revolutionizing the way people shop by combining cutting-edge AI technology with a deep understanding of consumer needs.
            </p>
            <p className="text-lg text-[#71B836] font-medium max-w-2xl mx-auto">
              ShoppyS is an abbreviation of Shoppy Sensay and uses the chat API from Sensay.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Our Mission</h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  To make shopping effortless, intelligent, and personalized for everyone. We believe that finding the perfect product shouldn't be a challenge - it should be a conversation.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">What We Do</h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  Using advanced artificial intelligence, we understand your preferences, budget, and needs to recommend products that truly match what you're looking for. No more endless scrolling or decision fatigue.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Our Vision</h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  A world where shopping is intuitive, efficient, and enjoyable. Where AI doesn't replace human choice, but enhances it by understanding your unique preferences and needs.
                </p>
              </div>
            </div>

            {/* Right Content - Visual */}
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-[#71B836]/10 dark:bg-[#71B836]/20 rounded-2xl flex items-center justify-center">
                      <Bot className="w-8 h-8 text-[#71B836]" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">AI-Powered</h4>
                      <p className="text-gray-600 dark:text-gray-300">Advanced machine learning algorithms</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-[#71B836]/10 dark:bg-[#71B836]/20 rounded-2xl flex items-center justify-center">
                      <Users className="w-8 h-8 text-[#71B836]" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">User-Centric</h4>
                      <p className="text-gray-600 dark:text-gray-300">Designed with your needs in mind</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-[#71B836]/10 dark:bg-[#71B836]/20 rounded-2xl flex items-center justify-center">
                      <Zap className="w-8 h-8 text-[#71B836]" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">Lightning Fast</h4>
                      <p className="text-gray-600 dark:text-gray-300">Instant recommendations and results</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#71B836]/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#71B836]/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#71B836] rounded-3xl p-12 text-center shadow-2xl">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-12">Trusted by Thousands</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group">
                <div className="flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-white/80 mr-2" />
                  <div className="text-4xl md:text-5xl font-bold text-white group-hover:scale-110 transition-transform duration-300">25K+</div>
                </div>
                <div className="text-white/80 text-lg font-medium">Happy Customers</div>
              </div>
              <div className="group">
                <div className="flex items-center justify-center mb-4">
                  <Star className="w-8 h-8 text-white/80 mr-2" />
                  <div className="text-4xl md:text-5xl font-bold text-white group-hover:scale-110 transition-transform duration-300">150K+</div>
                </div>
                <div className="text-white/80 text-lg font-medium">Products Recommended</div>
              </div>
              <div className="group">
                <div className="flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-white/80 mr-2" />
                  <div className="text-4xl md:text-5xl font-bold text-white group-hover:scale-110 transition-transform duration-300">98%</div>
                </div>
                <div className="text-white/80 text-lg font-medium">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Have questions or want to learn more? We'd love to hear from you. Connect with us on our social platforms.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Telegram */}
              <div className="group text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-[#71B836] rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Telegram</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Quick support and updates</p>
                <a 
                  href="https://t.me/mimpowo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-[#71B836] hover:bg-[#5A9A2E] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>@mimpowo</span>
                </a>
              </div>

              {/* X (Twitter) */}
              <div className="group text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Twitter className="w-6 h-6 text-white dark:text-gray-900" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">X (Twitter)</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Latest news and announcements</p>
                <a 
                  href="https://x.com/mimpowo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  <Twitter className="w-4 h-4" />
                  <span>@mimpowo</span>
                </a>
              </div>

              {/* GitHub */}
              <div className="group text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Github className="w-6 h-6 text-white dark:text-gray-900" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">GitHub</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Open-source projects</p>
                <a 
                  href="https://github.com/envexx" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  <Github className="w-4 h-4" />
                  <span>@envexx</span>
                </a>
              </div>
            </div>

            {/* Additional Contact Info */}
            <div className="mt-12 text-center">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Need Help?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Our team is here to help you get the most out of ShoppyS.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 text-sm">
                    <div className="w-1.5 h-1.5 bg-[#71B836] rounded-full"></div>
                    <span>24/7 Support</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 text-sm">
                    <div className="w-1.5 h-1.5 bg-[#71B836] rounded-full"></div>
                    <span>Quick Response</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Transform Your Shopping?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
            Join thousands of happy customers who have discovered the future of smart shopping.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={handleGetStarted}
              className="bg-[#71B836] hover:bg-[#5A9A2E] text-white px-12 py-4 rounded-xl font-semibold text-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-3"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <img 
                src="./ShoppyS logo .png" 
                alt="ShoppyS Logo" 
                className="w-10 h-10 rounded-xl shadow-lg"
              />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">ShoppyS</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-600 dark:text-gray-300 text-lg">© 2024 ShoppyS. All rights reserved.</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Powered by Advanced AI Technology</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;