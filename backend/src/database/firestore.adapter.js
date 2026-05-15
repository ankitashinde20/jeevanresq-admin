/*
 * Firestore production adapter blueprint.
 *
 * The app runs free locally with the in-memory repository in ../repository/index.js.
 * For production, initialize firebase-admin here and replace repository methods with
 * these collection helpers while keeping the same route/controller contracts.
 */

export function firestoreCollection(db, name) {
  const ref = db.collection(name);
  return {
    async list() {
      const snapshot = await ref.orderBy('createdAt', 'desc').limit(500).get();
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
    async get(id) {
      const doc = await ref.doc(id).get();
      return doc.exists ? { id: doc.id, ...doc.data() } : null;
    },
    async create(payload) {
      const doc = await ref.add({ ...payload, createdAt: new Date().toISOString() });
      const created = await doc.get();
      return { id: created.id, ...created.data() };
    },
    async update(id, payload) {
      await ref.doc(id).set({ ...payload, updatedAt: new Date().toISOString() }, { merge: true });
      const updated = await ref.doc(id).get();
      return updated.exists ? { id: updated.id, ...updated.data() } : null;
    }
  };
}

