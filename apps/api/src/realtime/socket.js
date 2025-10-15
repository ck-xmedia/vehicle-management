let io
export const setupRealtime = (server) => { io = server; }
export const ioEmit = (namespace, event, payload) => { if (!io) return; io.emit(`${namespace}:${event}`, payload || {}) }
