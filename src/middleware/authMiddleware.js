// const { jwtVerify } = require('jose');
// const { TextEncoder } = require('util');

// // Paths that don't require authentication
// const publicPaths = ['/login'];

// // Paths that require admin role only
// const adminPaths = ['/roles'];

// const authMiddleware = async (req, res, next) => {
//     const path = req.path;
//     console.log("MIDDLEWARE PATH:", path);

//     // Allow public paths
//     if (publicPaths.includes(path)) {
//         return next();
//     }

//     // Get token from cookie
//     const token = req.cookies.token;
//     console.log("Token present:", !!token); // Debug log

//     // Check if user is authenticated
//     if (!token) {
//         console.log("NO TOKEN");
//         // In production, redirect to the frontend login page
//         if (process.env.NODE_ENV === 'production') {
//             return res.redirect(process.env.FRONTEND_URL + '/login');
//         }
//         return res.redirect('/login');
//     }

//     try {
//         // Verify token using jose
//         const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//         const { payload } = await jwtVerify(token, secret);
//         const decoded = payload;

//         // Check if user has admin role for admin-only paths
//         if (adminPaths.some(p => path.startsWith(p)) && decoded.role !== 'admin') {
//             // Redirect non-admin users to dashboard
//             if (process.env.NODE_ENV === 'production') {
//                 return res.redirect(process.env.FRONTEND_URL);
//             }
//             return res.redirect('/');
//         }

//         // Add user info to request object for use in routes
//         req.user = decoded;
//         next();
//     } catch (error) {
//         console.log("MIDDLEWARE ERROR:", error);
//         // In production, redirect to the frontend login page
//         if (process.env.NODE_ENV === 'production') {
//             return res.redirect(process.env.FRONTEND_URL + '/login');
//         }
//         return res.redirect('/login');
//     }
// };

// module.exports = authMiddleware; 