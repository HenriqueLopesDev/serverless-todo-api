export default {
  type: "object",
  properties: {
    todosId: {type: 'string'},
    title: {type: 'string'},
    description: {type: 'string'},
    status: {type: Boolean},
    createdAt: {type: Date},
  },
  required: ['title', 'description'],
} as const;