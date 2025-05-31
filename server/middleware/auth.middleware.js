import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || "dev-jualdgdxsldqmwm3.us.auth0.com";
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE || "https://job-platform.api";
const JWT_SECRET = process.env.JWT_KEY || "your_jwt_secret";

console.log('Auth Configuration:', {
  auth0Domain: AUTH0_DOMAIN,
  auth0Audience: AUTH0_AUDIENCE,
  hasJwtSecret: !!JWT_SECRET
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
  const authHeader = req.headers.authorization;
  
  console.log('Authenticating request:', {
    hasAuthHeader: !!authHeader,
    authHeaderPrefix: authHeader ? authHeader.substring(0, 20) + '...' : null,
    method: req.method,
    path: req.path,
    body: req.body
  });

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing or malformed token" });
  }

  const token = authHeader.split(" ")[1];

  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Regular JWT verification successful:', {
      email: decoded.email,
      userId: decoded.userId,
      tokenFields: Object.keys(decoded)
    });
    req.user = decoded;
    return next();
  } catch (jwtError) {
    console.log('Regular JWT verification failed:', {
      name: jwtError.name,
      message: jwtError.message,
      expiredAt: jwtError.expiredAt
    });
    console.log('Trying Auth0 verification...');
    
    // If regular JWT fails, try Auth0
    auth0JwtCheck(req, res, async (auth0Error) => {
      if (!auth0Error && req.auth0User) {
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
              userEmail = await getUserInfoFromAuth0(token);
            } catch (error) {
              console.error('Error fetching user info:', error);
            }
          }

          if (!userEmail) {
            console.error('No email found in Auth0 token');
            return res.status(401).json({ 
              error: "No email found in token",
              message: "Please ensure your token includes email"
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

      // If both regular JWT and Auth0 fail, return error with details
      console.error('Authentication failed for both methods:', {
        jwtError: {
          name: jwtError.name,
          message: jwtError.message,
          expiredAt: jwtError.expiredAt
        },
        auth0Error: auth0Error ? {
          name: auth0Error.name,
          message: auth0Error.message
        } : null
      });

      return res.status(401).json({ 
        error: "Invalid or expired token",
        message: "Please log in again",
        details: jwtError.message
      });
    });
  }
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
