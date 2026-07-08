// workers/app.ts
import { createWorkerEntrypoint } from "cloudflare:workers";
import { createRequestHandler } from "react-router";

declare module "react-router" {
	export interface AppLoadContext {
		cloudflare: {
			env: Env;
			ctx: ExecutionContext;
		};
	}
}

// Create the request handler with server build and mode
const requestHandler = createRequestHandler(
	() => import("virtual:react-router/server-build"),
	import.meta.env.MODE,
);

// Define types for Cloudflare Worker environment
interface Env {
	// Add your Cloudflare environment variables here
	R2_BUCKET: R2Bucket;
	KV_NAMESPACE: KVNamespace;
	DATABASE_URL?: string;
	JWT_SECRET?: string;
}

// Error handling middleware
async function handleErrors(
	request: Request,
	env: Env,
	ctx: ExecutionContext,
	next: () => Promise<Response>,
): Promise<Response> {
	try {
		return await next();
	} catch (e: any) {
		console.error(`Error in request: ${e.message}`);
		
		// Return a user-friendly error page in production
		const errorResponse = new Response(
			JSON.stringify({
				error: "Internal Server Error",
				message: import.meta.env.MODE === "development" 
					? e.message 
					: "An unexpected error occurred"
			}),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
					"X-Status-Code": "500"
				}
			}
		);
		
		return errorResponse;
	}
}

// CORS middleware
function addCorsHeaders(response: Response): Response {
	response.headers.set("Access-Control-Allow-Origin", "*");
	response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
	response.headers.set("Access-Control-Max-Age", "86400"); // 24 hours
	return response;
}

// Main worker handler
export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		// Handle preflight CORS requests
		if (request.method === "OPTIONS") {
			return new Response(null, {
				status: 204,
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
					"Access-Control-Max-Age": "86400",
				},
			});
		}

		// Add security headers to all responses
		const response = await handleErrors(request, env, ctx, async () => {
			// Pass Cloudflare-specific context to the React Router handler
			const context: AppLoadContext = {
				cloudflare: { env, ctx }
			};

			return requestHandler(request, context);
		});

		// Apply CORS headers to the response
		const corsResponse = addCorsHeaders(response.clone());
		
		// Set cache control for static assets
		const url = new URL(request.url);
		if (url.pathname.startsWith("/assets/") || url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico)$/)) {
			corsResponse.headers.set("Cache-Control", "public, max-age=31536000, immutable");
		} else {
			// For dynamic content, prevent caching in browsers but allow CDN caching
			corsResponse.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
		}

		return corsResponse;
	},

	// Scheduled task handler (if needed)
	scheduled(
		controller: ScheduledController,
		env: Env,
		ctx: ExecutionContext
	): void {
		// Example: Clean up old temporary files
		ctx.waitUntil(
			(async () => {
				try {
					// Perform cleanup tasks
					console.log("Running scheduled maintenance...");
				} catch (e) {
					console.error("Scheduled task failed:", e);
				}
			})()
		);
	}
} satisfies ExportedHandler<Env>;
