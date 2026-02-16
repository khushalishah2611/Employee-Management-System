import { HumanResources } from '../models/HR.model.js'
import { Organization } from '../models/Organization.model.js'

const applyWhere = (where = {}) => {
  const query = { ...where }

  if (query.OR) {
    query.$or = query.OR
    delete query.OR
  }

  for (const key of Object.keys(query)) {
    if (key === 'id') {
      query._id = query.id
      delete query.id
      continue
    }

    if (query[key] && typeof query[key] === 'object' && 'gt' in query[key]) {
      query[key] = { $gt: query[key].gt }
    }
  }

  return query
}

const normalizeDoc = (doc) => {
  if (!doc) {
    return null
  }

  const json = doc.toObject ? doc.toObject() : doc
  if (json._id) {
    json.id = String(json._id)
  }

  return json
}

const modelClient = (Model) => ({
  findFirst: async ({ where }) => normalizeDoc(await Model.findOne(applyWhere(where))),
  findUnique: async ({ where }) => normalizeDoc(await Model.findOne(applyWhere(where))),
  create: async ({ data }) => normalizeDoc(await Model.create(data)),
  update: async ({ where, data }) => {
    const normalized = { ...data }
    for (const key of Object.keys(normalized)) {
      if (normalized[key] && typeof normalized[key] === 'object' && 'push' in normalized[key]) {
        normalized.$push = normalized.$push || {}
        normalized.$push[key] = normalized[key].push
        delete normalized[key]
      }
    }

    const doc = await Model.findOneAndUpdate(applyWhere(where), normalized, { new: true })
    return normalizeDoc(doc)
  },
})

export const prisma = {
  $connect: async () => true,
  $transaction: async (callback) => callback(prisma),
  humanResources: modelClient(HumanResources),
  organization: modelClient(Organization),
}
