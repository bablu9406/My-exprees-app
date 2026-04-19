exports.calculateRevenue = (views = 1) => {
  const perView = 0.05;

  const total = views * perView;

  return {
    total,
    creator: total * 0.7,
    platform: total * 0.3
  };
};