const REQUESTS_KEY = 'isansu_requests'
const GENERATED_KEY = 'isansu_generated'
const VOTER_KEY = 'isansu_voter_id'

function getVoterId() {
  let id = localStorage.getItem(VOTER_KEY)
  if (!id) {
    id = 'v_' + Math.random().toString(36).slice(2, 10)
    localStorage.setItem(VOTER_KEY, id)
  }
  return id
}

export function getRequests() {
  try { return JSON.parse(localStorage.getItem(REQUESTS_KEY) || '[]') }
  catch { return [] }
}

export function addRequest({ name, description, category }) {
  const requests = getRequests()
  const req = {
    id: 'req_' + Date.now(),
    name,
    description,
    category,
    votes: 1,
    votedBy: [getVoterId()],
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  requests.unshift(req)
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests))
  return req
}

export function voteRequest(id) {
  const requests = getRequests()
  const voterId = getVoterId()
  const req = requests.find(r => r.id === id)
  if (!req) return false
  if (req.votedBy?.includes(voterId)) return false
  req.votes = (req.votes || 0) + 1
  req.votedBy = [...(req.votedBy || []), voterId]
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests))
  return true
}

export function hasVoted(id) {
  const requests = getRequests()
  const req = requests.find(r => r.id === id)
  return req?.votedBy?.includes(getVoterId()) ?? false
}

export function updateRequestStatus(id, status, generatedId) {
  const requests = getRequests()
  const req = requests.find(r => r.id === id)
  if (!req) return
  req.status = status
  if (generatedId) req.generatedId = generatedId
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests))
}

export function getGenerated() {
  try { return JSON.parse(localStorage.getItem(GENERATED_KEY) || '[]') }
  catch { return [] }
}

export function saveGenerated({ requestId, name, spec }) {
  const generated = getGenerated()
  const id = name
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]/g, '-')
    .replace(/-+/g, '-')
    + '-' + Date.now().toString(36)
  const calc = {
    id,
    requestId,
    name,
    spec,
    path: `/dynamic/${id}`,
    createdAt: new Date().toISOString(),
  }
  generated.unshift(calc)
  localStorage.setItem(GENERATED_KEY, JSON.stringify(generated))
  return calc
}

export function getTopRequests(limit = 5) {
  const now = new Date()
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)
  return getRequests()
    .filter(r => new Date(r.createdAt) >= weekAgo)
    .sort((a, b) => b.votes - a.votes)
    .slice(0, limit)
}
