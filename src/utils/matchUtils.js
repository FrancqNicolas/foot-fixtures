export const sortMatches = (matches) => {
  return matches.sort((a, b) => {
    const statusOrder = { 'scheduled': 0, 'live': 1, 'finished': 2 };

    if (a.status !== b.status) {
      return statusOrder[a.status] - statusOrder[b.status];
    }

    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    if (a.status === 'finished') {
      return dateB - dateA;
    }
    return dateA - dateB;
  });
};

export const groupMatchesByDate = (matches) => {
  const grouped = {};

  matches.forEach((match) => {
    const date = match.date ? new Date(match.date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Date non définie';

    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(match);
  });

  return grouped;
};
