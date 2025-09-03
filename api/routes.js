// Vercel API Routes - Simplified following documentation
const express = require('express');
const router = express.Router();

// Import services (akan diimplementasikan sesuai kebutuhan)
// const { SensayService } = require('../src/server/sensay-service');
// const { registerUser, loginUser, authenticateToken } = require('../src/server/auth');

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Shoppy Sensay API',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Auth routes
router.post('/auth/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Email, username, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // TODO: Implementasi registrasi sesuai dokumentasi
    // const result = await registerUser(email, username, password);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: { email, username },
        token: 'jwt_token_here'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ 
      error: error.message || 'Registration failed'
    });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    
    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: 'Email/username and password are required' });
    }

    // TODO: Implementasi login sesuai dokumentasi
    // const result = await loginUser(emailOrUsername, password);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: { 
          id: 'user_id',
          email: 'user@example.com',
          username: 'username'
        },
        token: 'jwt_token_here'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ 
      error: error.message || 'Login failed'
    });
  }
});

// Chat routes following documentation
router.post('/chat/start', async (req, res) => {
  try {
    const { replicaUuid, sessionName } = req.body;
    
    if (!replicaUuid) {
      return res.status(400).json({ error: 'Replica UUID is required' });
    }

    // TODO: Implementasi initiateChatSession sesuai dokumentasi
    // const session = await sensayService.initiateChatSession(userId, replicaUuid, sessionName);
    
    res.json({
      success: true,
      message: 'Chat session initiated',
      data: {
        sensay_user_id: 'sensay_user_id',
        replica_uuid: replicaUuid
      }
    });
  } catch (error) {
    console.error('Start chat error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to start chat session'
    });
  }
});

router.post('/chat/send', async (req, res) => {
  try {
    const { message, isNewChat, sessionId } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // TODO: Implementasi sendMessageToReplica sesuai dokumentasi
    // const response = await sensayService.sendMessageToReplica(userId, replicaUuid, message);
    
    res.json({
      success: true,
      data: {
        success: true,
        message: 'AI response here',
        sessionId: sessionId || 'new_session_id',
        timestamp: new Date().toISOString(),
        isNewSession: isNewChat || false
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: error.message || 'Chat failed'
    });
  }
});

router.get('/chat/history', async (req, res) => {
  try {
    const { sessionId } = req.query;
    
    // TODO: Implementasi loadChatHistory sesuai dokumentasi
    // const history = await sensayService.loadChatHistory(userId, replicaUuid, 'web');
    
    res.json({
      success: true,
      data: [
        {
          id: 'message_id',
          content: 'Sample message',
          role: 'user',
          timestamp: new Date().toISOString()
        }
      ]
    });
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to get chat history'
    });
  }
});

router.get('/chat/sessions', async (req, res) => {
  try {
    // TODO: Implementasi getUserReplicaSessions sesuai dokumentasi
    // const sessions = await sensayService.getUserReplicaSessions(userId);
    
    res.json({
      success: true,
      data: [
        {
          id: 'session_id',
          title: 'Chat Session',
          lastMessage: 'Last message content',
          timestamp: new Date().toISOString(),
          messageCount: 5
        }
      ]
    });
  } catch (error) {
    console.error('Chat sessions error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to get chat sessions'
    });
  }
});

// Admin routes (untuk debugging)
router.get('/admin/users', async (req, res) => {
  try {
    // TODO: Implementasi admin check
    // if (!req.user || !req.user.email.includes('admin')) {
    //   return res.status(403).json({ error: 'Admin access required' });
    // }

    res.json({
      success: true,
      data: [
        {
          id: 'user_id',
          email: 'user@example.com',
          username: 'username',
          createdAt: new Date().toISOString()
        }
      ]
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to get users'
    });
  }
});

// Export router
module.exports = router;