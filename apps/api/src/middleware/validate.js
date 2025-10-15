export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({ body: req.body, params: req.params, query: req.query })
    req.validated = parsed
    next()
  } catch (e) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid request', details: e.errors } })
  }
}
