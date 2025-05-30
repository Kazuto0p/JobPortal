import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || "dev-jualdgdxsldqmwm3.us.auth0.com";
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE || "https://job-platform.api";

const JWT_SECRET = process.env.JWT_KEY;

console.log('Auth0 Configuration:', {
  domain: AUTH0_DOMAIN,
  audience: AUTH0_AUDIENCE
});

const auth0JwtCheck = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: AUTH0_AUDIENCE,
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
  requestProperty: "auth0User",
  credentialsRequired: false,
});

export const authenticateUser = (req, res, next) => {
  console.log('Authenticating request:', {
    hasAuthHeader: !!req.headers.authorization,
    authHeaderValue: req.headers.authorization?.substring(0, 20) + '...',
    sessionUser: !!req.session?.user,
    method: req.method,
    path: req.path
  });

  // 1. If session user exists, authenticate from session
  if (req.session?.user) {
    req.user = req.session.user;
    return next();
  }

  // 2. Use Auth0 JWT middleware
  auth0JwtCheck(req, res, async (err) => {
    if (!err && req.auth0User) {
      try {
        // Extract email from Auth0 token
        const email = req.auth0User?.email || 
                     req.auth0User?.['https://your-auth0-domain/email'] ||
                     req.auth0User?.['https://job-platform.api/email'] ||
                     req.auth0User?.['https://dev-jualdgdxsldqmwm3.us.auth0.com/email'];

        let userEmail = email;
        
        // If no email found and it's a Google OAuth user, try to fetch from userinfo endpoint
        if (!userEmail && req.auth0User?.sub?.startsWith('google-oauth2|')) {
          try {
            const token = req.headers.authorization?.split(' ')[1];
            userEmail = await getUserInfoFromAuth0(token);
          } catch (error) {
            console.error('Error fetching user info:', error);
          }
        }

        console.log('Auth0 token detailed contents:', {
          hasEmail: !!userEmail,
          tokenFields: Object.keys(req.auth0User || {}),
          sub: req.auth0User?.sub,
          rawToken: req.auth0User
        });

        if (!userEmail) {
          console.error('No email found in Auth0 token. Token contents:', req.auth0User);
          return res.status(401).json({ 
            error: "No email found in token",
            message: "Please ensure your Auth0 token includes email scope"
          });
        }

        // Attach user info to req.user
        req.user = {
          email: userEmail,
          ...req.auth0User
        };
        
        console.log('Auth0 authentication successful:', {
          email: req.user.email,
          sub: req.user.sub
        });
        
        return next();
      } catch (error) {
        console.error('Error processing Auth0 token:', error);
        return res.status(401).json({ error: "Error processing authentication" });
      }
    }

    if (err) {
      console.error('Auth0 authentication error:', {
        name: err.name,
        message: err.message,
        code: err.code,
        status: err.status,
        inner: err.inner
      });
    }

    // 3. If no Auth0 token or invalid, fallback to your own JWT verification
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Missing or malformed token" });
    }

    const token = authHeader.split(" ")[1];
    try {
      if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
      }
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      console.log('JWT authentication successful:', {
        email: req.user.email,
        tokenFields: Object.keys(decoded)
      });
      return next();
    } catch (error) {
      console.error('JWT verification error:', {
        name: error.name,
        message: error.message,
        expiredAt: error.expiredAt
      });
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  });
};

async function getUserInfoFromAuth0(token) {
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const response = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.status}`);
    }
    
    const data = await response.json();
    return data.email;
  } catch (error) {
    console.error('Error fetching user info from Auth0:', error);
    return null;
  }
}
