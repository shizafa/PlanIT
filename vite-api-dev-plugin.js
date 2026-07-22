function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk) => {
      raw += chunk
    })
    req.on('end', () => resolve(raw))
    req.on('error', reject)
  })
}

function wrapResponse(res) {
  res.status = (code) => {
    res.statusCode = code
    return res
  }
  res.json = (payload) => {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(payload))
  }
  return res
}

// Resolves an /api/* path (with the /api prefix already stripped by the mount point)
// to the matching Vercel-style function module, mirroring Vercel's file-based routing.
function resolveApiModule(pathname) {
  if (pathname === '/generate') {
    return { modulePath: '/api/generate.js', query: {} }
  }

  if (pathname === '/delete-account') {
    return { modulePath: '/api/delete-account.js', query: {} }
  }

  const swapMatch = pathname.match(/^\/trips\/([^/]+)\/swap-activity$/)
  if (swapMatch) {
    return { modulePath: '/api/trips/[id]/swap-activity.js', query: { id: swapMatch[1] } }
  }

  return null
}

export default function apiDevPlugin() {
  return {
    name: 'api-dev-plugin',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res) => {
        try {
          const pathname = req.url.split('?')[0]
          const match = resolveApiModule(pathname)
          if (!match) {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Not found' }))
            return
          }

          const raw = await readBody(req)
          req.body = raw ? JSON.parse(raw) : {}
          req.query = match.query

          const { default: handler } = await server.ssrLoadModule(match.modulePath)
          await handler(req, wrapResponse(res))
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err.message }))
        }
      })
    },
  }
}
