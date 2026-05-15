import { repository } from '../repository/index.js';

export function startSimulationFeed(io) {
  if (process.env.NODE_ENV === 'production') return;
  setInterval(() => {
    const snapshot = repository.analytics.snapshot();
    io.emit('analytics:update', snapshot);
  }, 15000);
}

