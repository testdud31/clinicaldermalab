import os, glob, json

with open('reviews_metadata.json') as f:
    META = json.load(f)

inputs = {
    'main': "path.resolve(__dirname, 'index.html')",
    'blog': "path.resolve(__dirname, 'blog.html')",
    'reviewsDir': "path.resolve(__dirname, 'reviews/index.html')",
    'aboutDir': "path.resolve(__dirname, 'about/index.html')",
    'about': "path.resolve(__dirname, 'about.html')",
    'contactDir': "path.resolve(__dirname, 'contact/index.html')",
    'contact': "path.resolve(__dirname, 'contact.html')",
    'privacyDir': "path.resolve(__dirname, 'privacy-policy/index.html')",
    'privacy': "path.resolve(__dirname, 'privacy-policy.html')",
    'termsDir': "path.resolve(__dirname, 'terms/index.html')",
    'terms': "path.resolve(__dirname, 'terms.html')",
    'methodologyDir': "path.resolve(__dirname, 'methodology/index.html')",
    'methodology': "path.resolve(__dirname, 'methodology.html')",
    'treatmentsDir': "path.resolve(__dirname, 'treatments/index.html')",
    'treatments': "path.resolve(__dirname, 'treatments.html')",
    'conditionsDir': "path.resolve(__dirname, 'conditions/index.html')",
    'conditions': "path.resolve(__dirname, 'conditions.html')",
    'scienceIngredientsDir': "path.resolve(__dirname, 'science-and-ingredients/index.html')",
    'scienceIngredients': "path.resolve(__dirname, 'science-and-ingredients.html')",
    'medicalReviewBoardDir': "path.resolve(__dirname, 'medical-review-board/index.html')",
    'medicalReviewBoard': "path.resolve(__dirname, 'medical-review-board.html')",
    'notFound': "path.resolve(__dirname, '404.html')",
}

for slug in sorted(META.keys()):
    camel = ''.join(w.capitalize() for w in slug.split('-'))
    inputs[f'{camel}Dir'] = f"path.resolve(__dirname, 'reviews/{slug}/index.html')"
    inputs[f'{camel}Stub'] = f"path.resolve(__dirname, '{slug}-review.html')"

input_lines = []
for k, v in inputs.items():
    input_lines.append(f"          '{k}': {v},")

input_block = "\n".join(input_lines)

vite_code = f"""import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {{defineConfig}} from 'vite';

export default defineConfig(() => {{
  return {{
    plugins: [
      {{
        name: 'seo-and-domain-redirect-middleware',
        configureServer(server) {{
          server.middlewares.use((req, res, next) => {{
            const url = req.url || '';
            const pathname = url.split('?')[0].split('#')[0];
            const search = url.includes('?') ? '?' + url.split('?')[1] : '';

            // 1. Host Domain Redirect
            const rawHost = (req.headers['x-forwarded-host'] as string) || req.headers.host || '';
            const hostname = rawHost.split(',')[0].trim().split(':')[0];
            if (hostname === 'clinicaldermalab.ai.studio' || hostname.endsWith('.clinicaldermalab.ai.studio')) {{
              res.writeHead(301, {{ Location: `https://clinicaldermalab.io${{req.url || ''}}` }});
              res.end();
              return;
            }}

            // 2. Sitemap.xml serving with 200 OK and proper XML MIME type
            if (pathname === '/sitemap.xml') {{
              const sitemapPath = path.resolve(__dirname, 'sitemap.xml');
              if (fs.existsSync(sitemapPath)) {{
                res.writeHead(200, {{
                  'Content-Type': 'application/xml; charset=UTF-8',
                  'Cache-Control': 'public, max-age=3600',
                }});
                res.end(fs.readFileSync(sitemapPath, 'utf8'));
                return;
              }}
            }}

            // 3. HTTP 301 Redirections for legacy .html paths to clean trailing-slash directories
            const staticMap: Record<string, string> = {{
              '/about.html': '/about/',
              '/methodology.html': '/methodology/',
              '/blog.html': '/reviews/',
              '/contact.html': '/contact/',
              '/terms.html': '/terms/',
              '/privacy-policy.html': '/privacy-policy/',
              '/conditions.html': '/conditions/',
              '/treatments.html': '/treatments/',
              '/science-and-ingredients.html': '/science-and-ingredients/',
              '/medical-review-board.html': '/medical-review-board/',
            }};

            if (staticMap[pathname]) {{
              res.writeHead(301, {{ Location: staticMap[pathname] + search }});
              res.end();
              return;
            }}

            const reviewMatch = pathname.match(/^\\/([a-z0-9-]+)-review\\.html$/);
            if (reviewMatch) {{
              res.writeHead(301, {{ Location: `/reviews/${{reviewMatch[1]}}/${{search}}` }});
              res.end();
              return;
            }}

            next();
          }});
        }},
        configurePreviewServer(server) {{
          server.middlewares.use((req, res, next) => {{
            const url = req.url || '';
            const pathname = url.split('?')[0].split('#')[0];
            const search = url.includes('?') ? '?' + url.split('?')[1] : '';

            const rawHost = (req.headers['x-forwarded-host'] as string) || req.headers.host || '';
            const hostname = rawHost.split(',')[0].trim().split(':')[0];
            if (hostname === 'clinicaldermalab.ai.studio' || hostname.endsWith('.clinicaldermalab.ai.studio')) {{
              res.writeHead(301, {{ Location: `https://clinicaldermalab.io${{req.url || ''}}` }});
              res.end();
              return;
            }}

            if (pathname === '/sitemap.xml') {{
              const sitemapPath = path.resolve(__dirname, 'sitemap.xml');
              if (fs.existsSync(sitemapPath)) {{
                res.writeHead(200, {{
                  'Content-Type': 'application/xml; charset=UTF-8',
                  'Cache-Control': 'public, max-age=3600',
                }});
                res.end(fs.readFileSync(sitemapPath, 'utf8'));
                return;
              }}
            }}

            const staticMap: Record<string, string> = {{
              '/about.html': '/about/',
              '/methodology.html': '/methodology/',
              '/blog.html': '/reviews/',
              '/contact.html': '/contact/',
              '/terms.html': '/terms/',
              '/privacy-policy.html': '/privacy-policy/',
              '/conditions.html': '/conditions/',
              '/treatments.html': '/treatments/',
              '/science-and-ingredients.html': '/science-and-ingredients/',
              '/medical-review-board.html': '/medical-review-board/',
            }};

            if (staticMap[pathname]) {{
              res.writeHead(301, {{ Location: staticMap[pathname] + search }});
              res.end();
              return;
            }}

            const reviewMatch = pathname.match(/^\\/([a-z0-9-]+)-review\\.html$/);
            if (reviewMatch) {{
              res.writeHead(301, {{ Location: `/reviews/${{reviewMatch[1]}}/${{search}}` }});
              res.end();
              return;
            }}

            next();
          }});
        }},
      }},
      react(),
      tailwindcss(),
    ],
    resolve: {{
      alias: {{
        '@': path.resolve(__dirname, '.'),
      }},
    }},
    build: {{
      rollupOptions: {{
        input: {{
{input_block}
        }},
      }},
    }},
    base: process.env.VITE_BASE_URL || process.env.BASE_URL || '/',
    server: {{
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {{}},
    }},
  }};
}});
"""

with open('vite.config.ts', 'w') as f:
    f.write(vite_code)

print("Updated vite.config.ts successfully!")
