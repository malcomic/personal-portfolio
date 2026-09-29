import { z } from "zod";

// The CSP has no 'unsafe-eval', and Zod's `new Function` capability probe is reported as a violation even though it's caught.
z.config({ jitless: true });
