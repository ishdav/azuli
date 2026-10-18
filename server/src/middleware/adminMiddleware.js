import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const protectAdmin = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if the token has admin role (we will set this during admin login)
      if (decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized as an admin' });
      }
      
      req.admin = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};