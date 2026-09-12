// Import behavior in JavaScript:
// 1. For regular imports of functions/objects/etc, the code is parsed but not executed
//    until the imported items are actually used
// 2. However, any top-level code in a module (outside functions) runs immediately
//    during import, regardless of whether the exported values are used
//
// In server.js case, it contains top-level code that runs on import:
// - Creates and starts HTTP server
// - Connects to MongoDB
// - Sets up process error handlers
// This happens even though we don't use the 'server' variable here
import "./server.js";

// Log startup information
console.log(`Application starting in ${process.env.NODE_ENV || 'development'} mode`);